/*
 * Socket.io handler for chatting
 * 
 * @author Mike
 */
'use strict';

const path = require('path');
const logger = require('../util/logger');
const util = require('../util/socketio_util');

const Database = require('../database/database_mysql');
const database = new Database('database_mysql');

class ChatHandler {

    constructor() {
        logger.debug('ChatHandler initialized.');

        this.clientCount = 0;
    }

    /**
     * Method to handle 'login' event
     */
    async login(io, socket, event, input, namespace, redis) {
        logger.debug('login called. this server namespace -> ' + namespace);

        // store mapping from user id to socket url
        const userSocketUrl = path.join(namespace, socket.id);
        redis.store.hset('myapp_user', input.id, userSocketUrl);
        logger.debug('added to redis : ' + input.id + ' -> ' + userSocketUrl);

        socket.userId = input.id;
        this.getClientCount(redis);
        
        
        // save this login event in chat.connection table
        try {
            const sqlName = 'chat_save_login';
            const params = {
                id: input.id,
                alias: input.alias,
                today: input.today,
                socket_id: socket.id
            };
			await database.execute(sqlName, params);
            logger.debug('chat_save_login sql executed.');
		} catch(err) {
			logger.debug('Error in executing sql -> ' + err);
		}


        // send response
        util.sendResponse(io, socket, event, '200', 'login success.', input.id);
    
        // send previous unsent messages
        try {
            const sqlName = 'chat_get_unsent_messages';
            const params = {
                receiver: input.id
            };
			const rows2 = await database.execute(sqlName, params);
            logger.debug('chat_get_unsent_messages sql executed.');
        
            logger.debug('ROWS -> ' + JSON.stringify(rows2));

            if (rows2 && rows2.length > 0) {
                
                for (let i = 0; i < rows2.length; i++) {
                    if (rows2[i].command === 'chat') {
                        // send message
                        const curData = {
                            requestCode: rows2[i].id,
                            sender: rows2[i].sender,
                            receiver: rows2[i].receiver,
                            command: rows2[i].command,
                            type: rows2[i].type,
                            data: rows2[i].data
                        }
                        util.sendData(io, 'message', curData, namespace, redis, true);
                    }
                }

                const sqlName = 'chat_update_unsent_messages';
                const params = {
                    receiver: input.id
                };
                await database.execute(sqlName, params);
                logger.debug('chat_update_unsent_messages sql executed.');
            
            }

        } catch(err) {
			logger.debug('Error in processing unsent messages -> ' + err);
		}

    };

    /**
     * Method to handle 'logout' event
     */
    async logout(io, socket, event, input, namespace, redis) {
        logger.debug('logout called. this server namespace -> ' + namespace);

        // store mapping from user id to socket url
        const userSocketUrl = path.join(namespace, socket.id);
        redis.store.hdel('myapp_user', input.id);
        logger.debug('removed from redis : ' + input.id);

        //socket.userId = input.id;
        this.getClientCount(redis);

        
        // save this logout event in chat.connection table
        try {
            const sqlName = 'chat_save_logout';
            const params = {
                id: input.id,
                socket_id: socket.id
            };
			const rows = await database.execute(sqlName, params);
            logger.debug('chat_save_logout sql executed.');
		} catch(err) {
			logger.debug('Error in executing sql -> ' + err);
		}


        // send response
        util.sendResponse(io, socket, event, '200', 'logout success.', input.id);
    };

    getClientCount(redis) {
        logger.debug(`getClientCount called.`);

        // get count of clients from redis
        redis.store.hlen('myapp_user', (err, count) => {  
            if (err) {
                logger.debug('Error in hlen from redis : ' + err);
                return;
            }

            logger.debug(`Count of clients : ${count}`);
        });

    }

    /**
     * Method to handle 'message' event
     */
    message(io, socket, event, input, namespace, redis) {
        if (input.receiver =='ALL') {
            // send to all
            util.sendAll(io, socket, event, input, namespace, redis, true);

            // send response
            util.sendResponse(io, socket, event, '200', 'sendAll requested.', input.userId);
        } else {
            // determine group chat and normal chat
            if (input.command === 'chat') {
                // send message
                util.sendData(io, event, input, namespace, redis, true);

                // send response
                util.sendResponse(io, socket, event, '200', 'sendData requested.', input.userId);
            } else if (input.command === 'groupchat') {
                // send broadcast message
                util.sendBroadcast(io, socket, event, data, namespace, redis, true);
                
                // send response
                util.sendResponse(io, socket, event, '200', 'sendBroadcast requested.', input.userId);
            
            } else if (input.command === 'session') {
                // send message
                util.sendData(io, event, input, namespace, redis, true);

                // send back trying
                if (input.method == 'invite') {
                    const output = {
                        sessionId: input.sessionId,
                        requestCode: input.requestCode,
                        userId: input.userId,
                        sender: input.sender,
                        receiver: input.receiver,
                        command: 'session',
                        method: 'trying',
                        code: '110',
                        category: input.category,
                        data:''
                    }

                    socket.emit('message', output);
                }

                // send response
                util.sendResponse(io, socket, event, '200', 'session requested.', input.userId);
            }

        }
    }
    
}

module.exports = ChatHandler;

