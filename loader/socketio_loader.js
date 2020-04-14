/*
 * socket.io loader
 * 
 * @author Mike
 */

'use strict';

const socketio_loader = {};

const config = require('../config/config');
const socketioConfig = require('../config/socketio_config');

// logger
const logger = require('../util/logger');

const util = require('../util/socketio_util');
const socketioFolder = '../socketio';


const Database = require('../database/database_mysql');
const database = new Database('database_mysql');


const fs = require('fs');
const path = require("path");


//===== Redis =====//

const redisAdapter = require('socket.io-redis');

// sentinels를 사용하는 경우와 사용하지 않는 경우 구분
let pubClient;
let subClient; 

let store;
let pub;
let sub;

// 일반 redis (sentinels 사용하지 않는 경우)
if (typeof(config.redis.failover) == 'undefined' || config.redis.failover == false) {
    const redis = require('redis');

    pubClient = redis.createClient(config.redis);
    subClient = redis.createClient(config.redis);

    store = redis.createClient(config.redis);
    pub = redis.createClient(config.redis);
    sub = redis.createClient(config.redis);

} else {  // Failover redis (sentinels 사용하는 경우)
    const ioRedis = require('ioredis');
 
    pubClient = new ioRedis(config.redis);
    subClient = new ioRedis(config.redis);

    store = new ioRedis(config.redis);
    pub = new ioRedis(config.redis);
    sub = new ioRedis(config.redis);
    
}

pubClient.on('error', (err) => {
    logger.debug('pubClient error -> ' + err);
});

subClient.on('error', (err) => {
    logger.debug('subClient error -> ' + err);
});
 
store.on('error', (err) => {
    logger.debug('store error -> ' + err);
});

pub.on('error', (err) => {
    logger.debug('pub error -> ' + err);
});

sub.on('error', (err) => {
    logger.debug('sub error -> ' + err);
});

const channel = 'myapp_message';

socketio_loader.load = async (server, app, sessionMiddleware, socketio, namespace) => {
	logger.debug('socketio_loader.load called.');
    
    const namespaceFilename = './socketio.pid';

    // reset old presence information
    let contents;

    try {
        // read in namespace file
        contents = fs.readFileSync(namespaceFilename, {encoding:'utf8'});
        logger.debug('read namespace file -> ' + contents);
    } catch(err) {
        logger.debug('Error in reading namespace file -> ' + err);
    }

    try {
        if (contents && contents.length > 0) {
            const params = {
                namespace: contents
            };

            const queryParams = {
				sqlName: 'chat_reset_presence',
				params: params
			}

            const rows = await database.execute(queryParams);
            logger.debug('chat_reset_presence sql executed.');
        }
    } catch(err) {
        logger.debug('Error in executing sql -> ' + err);
    }


    // starting socket.io server
    const io = socketio.listen(
        server, 
        config.socketio
    );
     

    // save namespace to config/socketio.namespace
    try {
        fs.writeFileSync(namespaceFilename, namespace, {encoding:'utf8'});
        
        logger.debug('namespace file saved to -> ' + namespaceFilename);
        logger.debug('write namespace file -> ' + namespace);
    } catch(err) {
        logger.debug('Error in saving file -> ' + err);
    }
    

    app.io = io;
    io.app = app;
    logger.info('socket.io service started.');


    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

        
    io.adapter(redisAdapter({
        pubClient: pubClient,
        subClient: subClient
    }));
 
    sub.subscribe(channel);
    logger.debug('redis subscribed -> ' + channel);
    
    const redis = {
        store: store,
        pub: pub,
        sub: sub
    }

    io.namespace = namespace;
    io.redis = redis;


    // event processing for connection
    io.sockets.on('connection', async (socket) => {
        logger.debug('connection -> ' + JSON.stringify(socket.request.connection._peername));
        logger.debug('socket id -> ' + socket.id);
 
        // save this connection event in chat.connection table
        try {
            const params = {
                socket_id: socket.id,
                namespace: namespace
            };
            
            const queryParams = {
				sqlName: 'chat_save_connection',
				params: params
            }
            
			const rows = await database.execute(queryParams);
            logger.debug('chat_save_connection sql executed.');
		} catch(err) {
			logger.debug('Error in executing sql -> ' + err);
		}

        // disconnect event
        socket.on('disconnect', async (reason) => {
            logger.debug('disconnect called. -> ' + socket.id);
            //logger.debug('disconnect called. -> ' + socket.userId + ', ' + socket.id);
            logger.debug('reason -> ' + reason);


            // save this disconnect event in chat.connection table
            try {
                const params = {
                    socket_id: socket.id
                };
                    
                const queryParams = {
                    sqlName: 'chat_save_disconnect',
                    params: params
                }
                
                const rows = await database.execute(queryParams);
                logger.debug('chat_save_disconnect sql executed.');
            } catch(err) {
                logger.debug('Error in executing sql -> ' + err);
            }


            
            if (socket.userId) {
                const curUserId = socket.userId;
                delete socket.userId;

                store.hdel('myapp_user', curUserId, (err) => {  
                    if (err) {
                        logger.debug('Error in redis hdel for userId -> ' + curUserId);
                        return;
                    }

                    logger.debug('redis hdel success for userId -> ' + curUserId);
                });
                
            }
            

        });

        // load handlers
        loadHandlers(io, server, app, socket, namespace, redis);

        // send response
        util.sendResponse(io, socket, 'initialized', '200', 'initialized success.', socket.id);
    });


    sub.on('message', (channel, data) => {
        logger.debug('message received from sub in channel -> ' + channel);
        logger.debug('INPUT -> ' + data);
    
        const input = JSON.parse(data);
        const event = input.$event;
        util.sendData(io, event, input, namespace, redis, false);
    })
    

};

// Handler processing in socketioConfig 
function loadHandlers(io, server, app, socket, namespace, redis) {
	const infoLen = socketioConfig.length;
	logger.debug('Count of event handler in socketio_config  : %d', infoLen);
  
	for (var i = 0; i < infoLen; i++) {
		const curItem = socketioConfig[i];
			
		// create filename
        const filename = path.join(__dirname, socketioFolder, curItem.file);
        logger.debug('filename #' + i + ' : ' + filename);
        
        loadModule(io, socket, filename, curItem, namespace, redis);
        
	}
}



function loadModule(io, socket, filename, curItem, namespace, redis) {
    const exists = fs.existsSync(filename + '.js');
    if (exists) {
        const Handler = require(filename);
        const handler = new Handler();

        logger.debug('Socket.io handler loaded from %s.', curItem.file);

        // register handler function
        registerHandler(io, socket, handler, curItem, namespace, redis);
    } else {
        logger.warn('No file %s -> not loaded.', filename + '.js');
    }

}

function registerHandler(io, socket, curHandler, curItem, namespace, redis) {
    socket.on(curItem.event, (input) => {
        logger.debug(`${curItem.event} event received.`);
        logger.debug('INPUT -> ' + JSON.stringify(input));

        curHandler[curItem.method](io, socket, curItem.event, input, namespace, redis);
    });
    
    logger.debug('Socket.io handler registered [%s] -> [%s]', curItem.event, curItem.method);
}
 


module.exports = socketio_loader;

