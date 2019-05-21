/*
 * socket.io loader
 * 
 * @author Mike
 */

'use strict';

const socketio_loader = {};

import socketioConfig from '../config/socketio_config';

// logger
import logger from '../util/logger';

import util from '../util/socketio_util';
const socketioFolder = '../socketio';


var fs = require('fs');
var path = require("path");


const redisAdapter = require('socket.io-redis');
const ioRedis = require('ioredis');

const ioRedisOptions = {
    sentinels: [
        { host:'127.0.0.1', port: 11425 },
        { host:'127.0.0.1', port: 11426 },
        { host:'127.0.0.1', port: 11427 }
    ],
    name: 'mymaster'
}

const pubClient = new ioRedis(ioRedisOptions);
const subClient = new ioRedis(ioRedisOptions);

pubClient.on('error', (err) => {
    console.log('pubClient error -> ' + err);
});

subClient.on('error', (err) => {
    console.log('subClient error -> ' + err);
});


const store = new ioRedis(ioRedisOptions);
const pub = new ioRedis(ioRedisOptions);
const sub = new ioRedis(ioRedisOptions);

store.on('error', (err) => {
    console.log('store error -> ' + err);
});

pub.on('error', (err) => {
    console.log('pub error -> ' + err);
});

sub.on('error', (err) => {
    console.log('sub error -> ' + err);
});

const channel = 'myapp_message';

socketio_loader.load = (server, app, sessionMiddleware, socketio, namespace) => {
	logger.debug('socketio_loader.load called.');
    
    // starting socket.io server
    const io = socketio.listen(
        server, 
        {
            pingInterval: 10000,
            pingTimeout: 5000,
            transports: [
		      'websocket', 
		      'flashsocket', 
		      'htmlfile', 
		      'xhr-polling', 
		      'jsonp-polling', 
		      'polling'
		    ]
        }
    );
     
    
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
    console.log('redis subscribed -> ' + channel);
    
    const redis = {
        store: store,
        pub: pub,
        sub: sub
    }


    // event processing for connection
    io.sockets.on('connection', (socket) => {
        logger.debug('connection -> ' + JSON.stringify(socket.request.connection._peername));
        logger.debug('socket id -> ' + socket.id);
 
        // disconnect event
        socket.on('disconnect', (reason) => {
            logger.debug('disconnect called. -> ' + socket.userId + ', ' + socket.id);
            logger.debug('reason -> ' + reason);

            if (socket.userId) {
                store.hdel('myapp_user', socket.userId, (err) => {  
                    if (err) {
                        logger.debug('Error in redis hdel for userId -> ' + socket.userId);
                        return;
                    }

                    logger.debug('redis hdel success for userId -> ' + socket.userId);
                });
            }
        });

        // load handlers
        loadHandlers(io, server, app, socket, namespace, redis);
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

