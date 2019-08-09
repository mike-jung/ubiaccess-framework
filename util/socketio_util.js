/**
 * Utility module for Socket.IO
 *
 * @author Mike
 */
'use strict';

import path from 'path';
import logger from './logger';

import Database from '../database/database_mysql';
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
 
// Send response to the recipient
thisModule.sendData = async (io, event, input, namespace, redis, resend) => {
    logger.debug('sendData called. this server namespace -> ' + namespace);
    
    if (resend) {
        
        // save this message event in chat.message table
        try {
            const sqlName = 'chat_save_message';
            const params = {
                id: input.requestCode,
                sender: input.sender,
                receiver: input.receiver,
                command: input.command,
                type: input.type,
                data: input.data,
                namespace: namespace,
                status: '100'
            };
            const rows = await database.execute(sqlName, params);
            logger.debug('chat_save_message sql executed.');
        } catch(err) {
            logger.debug('Error in executing sql -> ' + err);
        }

    }


    // get mapping data from redis
    redis.store.hget('myapp_user', input.receiver, async (err, userSocketUrl) => {  
        if (err) {
            logger.debug('Error in hget from redis : ' + err);
            return;
        }

        if (userSocketUrl) {
            logger.debug('value from redis : ' + input.receiver + ' -> ' + userSocketUrl);

            const inNamespace = path.dirname(userSocketUrl);
            const inSocketId = path.basename(userSocketUrl);
            logger.debug('parsed socket id : ' + inNamespace + ', ' + inSocketId);

            if (namespace === inNamespace) {

                if (io.sockets.connected[inSocketId]) {
                    logger.debug('event -> ' + event);
                    io.sockets.connected[inSocketId].emit(event, input);
                    logger.debug('sent to the client of this namespace.');

            
                    // save this message sent event in chat.message table
                    try {
                        const sqlName = 'chat_save_message_status';
                        const params = {
                            id: input.requestCode,
                            status: '200'
                        };
                        const rows = await database.execute(sqlName, params);
                        logger.debug('chat_save_message_status sql executed.');
                    } catch(err) {
                        logger.debug('Error in executing sql -> ' + err);
                    }


                } else {
                    logger.debug('client not found in this namespace.');

                    if (resend) {
                        input.$event = event;
                        redis.pub.publish(channel, JSON.stringify(input));
                        logger.debug('redis publish called to channel -> ' + channel);
                    } else {
                        logger.debug('publish is not called because of resend flag is false.');
                    }
                }
            } else {
                logger.debug('client is considered to be in other namespace.');

                if (resend) {
                    input.$event = event;
                    redis.pub.publish(channel, JSON.stringify(input));
                    logger.debug('redis publish called to channel -> ' + channel);
                } else {
                    logger.debug('publish is not called because of resend flag is false.');
                }
            }

        }
    })
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
thisModule.sendResponse = (io, socket, command, code, message, userid) => {
    logger.debug('sendResponse called.');

	var statusObj = {command: command, code: code, message: message, userid:userid};
	socket.emit('response', statusObj);
}


// Send response data
thisModule.sendResponseData = (io, socket, command, code, message, resultType, result, userid) => {
    logger.debug('sendResponseData called.');

    var statusObj = {command: command, code: code, message: message, resultType: resultType, result:result, userid:userid};
	socket.emit('response', statusObj);
}


module.exports = thisModule;
