/**
 * Utility module for Socket.IO
 *
 * @author Mike
 */
'use strict';

const path = require('path');
const logger = require('./logger');

const Database = require('../database/database_mysql');
const database = new Database('database_mysql');


const thisModule = {};

const channel = 'myapp_message';


// Send response to all recipients
thisModule.sendAll = (io, socket, event, input, namespace, redis, resend) => {
    logger.debug('sendAll called. this server namespace -> ' + namespace);

    io.sockets.emit(event, input);

    logger.debug('sendAll forwarded to other namespaces.');

    if (resend) {
        input.$event = event;
        redis.pub.publish(channel, JSON.stringify(input));
        logger.debug('redis publish called to channel -> ' + channel);
    } else {
        logger.debug('publish is not called because of resend flag is false.');
    }

}
 


// Send message to group
thisModule.sendGroup = async (io, input) => {
    logger.debug('sendGroup called.');
    
    io.in(input.roomId).emit('message_group', input);

    // MIKE START 191215
    io.in(input.agentId).emit('message_group', input);
}


// Send message to recipient
thisModule.send = async (io, input) => {
    logger.debug('send called.');
    
    thisModule.sendData(io, 'message', input, io.namespace, io.redis);
}


// Send response to the recipient
thisModule.sendData = async (io, event, input, namespace, redis, resend) => {
    logger.debug('sendData called. this server namespace -> ' + namespace + ', resend : ' + resend);
     

    // redis에서 매핑 값 가져오기
    try {
        const senderId = input.sender
        const receiverId = input.receiver

        const socketId = await redis.storeClient.hGet('user-socket', receiverId)  
        console.log('found socketId : ' + socketId);

        if (socketId && socketId.length > 1) {
            console.log('redis에서 가져온 값 : ' + receiverId + ' -> ' + socketId)

            io.of('/').to(socketId).emit('message', input);
            console.log(`클라이언트로 전송됨 : ${senderId} -> ${receiverId}`)
        } else {
            console.log('socket id is not found')
        }
    } catch(err) {
        console.log('redis에서 값을 가져와 전송하는 중 에러 : ' + err)
        return
    }

}
 
// Send broadcast response
thisModule.sendBroadcast = (io, socket, event, input, namespace, redis, resend) => {
    logger.debug('sendBroadcast called. this server namespace -> ' + namespace);

    socket.broadcast.emit(event, input);
    
    if (resend) {
        input.$event = event;
        redis.pub.publish(channel, JSON.stringify(input));
        logger.debug('redis publish called to channel -> ' + channel);
    } else {
        logger.debug('publish is not called because of resend flag is false.');
    }

}

// Send response
thisModule.sendResponse = (io, socket, command, code, message, socketId) => {
    logger.debug('sendResponse called.');

	var statusObj = {
        command: command, 
        code: code, 
        message: message, 
        data: socketId
    };
	socket.emit('response', statusObj);
}


// Send response data
thisModule.sendResponseData = (io, socket, command, code, message, resultType, result, userid) => {
    logger.debug('sendResponseData called.');

    var statusObj = {command: command, code: code, message: message, resultType: resultType, result:result, userid:userid};
	socket.emit('response', statusObj);
}


module.exports = thisModule;
