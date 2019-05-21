/*
 * Socket.io handler for chatting
 * 
 * @author Mike
 */
'use strict';

import path from 'path';
import logger from '../util/logger';
import util from '../util/socketio_util';

class ChatHandler {

    constructor() {
        logger.debug('ChatHandler initialized.');

        this.clientCount = 0;
    }

    /**
     * Method to handle 'login' event
     */
    login(io, socket, event, input, namespace, redis) {
        logger.debug('login called. this server namespace -> ' + namespace);

        // store mapping from user id to socket url
        const userSocketUrl = path.join(namespace, socket.id);
        redis.store.hset('myapp_user', input.id, userSocketUrl);
        logger.debug('added to redis : ' + input.id + ' -> ' + userSocketUrl);

        socket.userId = input.id;
        this.clientCount += 1;
        logger.debug(`Count of clients : ${this.clientCount}`);

        // send response
        util.sendResponse(io, socket, event, '200', 'login success.', input.id);
    };


    /**
     * Method to handle 'message' event
     */
    message(io, socket, event, input, namespace, redis) {
        if (input.receiver =='ALL') {
            // send to all
            util.sendAll(io, socket, event, input, namespace, redis);

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
                util.sendBroadcast(io, socket, event, data, namespace, redis);
                
                // send response
                util.sendResponse(io, socket, event, '200', 'sendBroadcast requested.', input.userId);
            }

        }
    }
}

module.exports = ChatHandler;

