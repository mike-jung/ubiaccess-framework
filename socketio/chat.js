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
        const userId = input.id
        const socketId = socket.id
 
        if (userId && socketId) {
            await redis.storeClient.hSet('user-socket', userId, socketId)
            socket.userId = userId
            console.log('redis에 로그인 id를 등록했습니다. : ' + userId + ' -> ' + socketId)
        } else {
            logger.error('userId 또는 socketId가 null입니다 : ' + userId + ', ' + socketId)
        }
 
        // send response
        util.sendResponse(io, socket, event, '200', 'login success.', input.id);
         
    };

    /**
     * Method to handle 'logout' event
     */
    async logout(io, socket, event, input, namespace, redis) {
        logger.debug('logout called. this server namespace -> ' + namespace);

        // 레디스에서 사용자 정보 삭제
        const socketId = socket.id
        this.deleteUserFromRedis(socket, socketId, redis);
  

        // send response
        util.sendResponse(io, socket, event, '200', 'logout success.', input.id);
    };
 
        
    async deleteUserFromRedis(socket, socketId, redis) {
        
        try {
            // 레디스에서 소켓ID로 사용자ID 확인
            //const userId = await redis.storeClient.hGet('socket-user', socketId);
            const userId = socket.userId;

            // 레디스에서 사용자ID로 삭제
            if (userId) {
                await redis.storeClient.hDel('user-socket', userId);
                logger.debug('redis hDel success for userId -> ' + userId);
            }

        } catch(err) {
            logger.debug('Error in deleting userId from redis : ' + err);
        }

        
        try {
            // 레디스에서 소켓ID로 삭제
            if (socketId) {
                await redis.storeClient.hDel('socket-user', socketId);
                logger.debug('redis hDel success for socketId -> ' + socketId);
            }

        } catch(err) {
            logger.debug('Error in deleting socketId from redis : ' + err);
        }
        

    }


    /**
     * Method to handle 'message' event
     */
    async message(io, socket, event, input, namespace, redis) {
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
            
            } 
        }
    }
    
}

module.exports = ChatHandler;

