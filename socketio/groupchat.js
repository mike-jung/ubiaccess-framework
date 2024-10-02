/*
 * Socket.io handler for chatting
 * 
 * @author Mike
 */
'use strict';

const path = require('path');
const logger = require('../util/logger');
const util = require('../util/socketio_util');

const config = require('../config/config');
const socketioConfig = require('../config/socketio_config');

const Database = require('../database/database_mysql');
const database = new Database('database_mysql');

const { createClient } = require('redis');

// 레디스 해시 (로그인 ID -> 레디스 클라이언트 객체)
const redisHash = new Map()

// 룸 해시 (로그인 ID -> 룸 객체)
const roomHash = new Map()

// 룸 리스트
const roomList = []


class GroupChatHandler {

    constructor() {
        logger.debug('GroupChatHandler initialized.');

        this.clientCount = 0;
        
    }

    /**
     * Method to handle 'login_group' event
     */
    async login_group(io, socket, event, input, namespace, redis) {
        logger.debug('login_group called. this server namespace -> ' + namespace);
 
        socket.join(input.roomId);

        roomHash.set(input.userId, input.roomId)

        // 이미 동일한 룸에 연결되어 있다면 연결 안함
        if (roomList.includes(input.roomId)) {
            logger.debug(`room ${input.roomId} is already exists.`);

            // send response
            util.sendResponse(io, socket, event, '200', 'login success.', input.roomId);
        
            return;
        }

        // 레디스 연결하기 (구독)
        if (typeof(redis) != 'undefined') {       

            redis.subClient.subscribe(input.roomId, (message) => {
                const data = message.toString('utf-8')

                logger.debug('redis received : ' + data)
        
                // 클라이언트로 메시지 전송
                const input = JSON.parse(data)

                logger.debug('server flag : ' + input.server)

                // 서버에서 전송한 것이 돌아온 경우가 아니면 처리
                if (typeof(input.server) == 'undefined') {

                    //const curRoom = roomHash.get(input.userId)
                    //const curRoom = 'MO-TEST1'
                    if (typeof(input.roomId) != 'undefined') {     
                        io.to(input.roomId).emit('message_group', input);

                        logger.debug('sent to room : ' + input.roomId)
                    } else {
                        logger.debug('room is not found for user : ' + input.userId)
                    }
            
                }

            }, true);

            logger.debug('redis subscribed -> ' + input.userId +', ' + input.roomId);

            redisHash.set(input.roomId, redis)
            roomList.push(input.roomId)


            // send response (success)
            util.sendResponse(io, socket, event, '200', 'login success.', input.roomId);
        } else {
            // send response (failure)
            util.sendResponse(io, socket, event, '400', 'login failed : redis is not valid.', input.roomId);
        }

    };

    /**
     * 레디스 서버에 연결하기
     */
    async connectRedis(io, redis, userId, roomId, connectRedisCallback) {
        logger.debug('connectRedis called. -> ' + userId + ', ' + roomId);
           
        Promise.all([redis.pubClient.connect(), redis.subClient.connect()]).then(() => {
            logger.debug("redis client connected.")

            // 레디스 구독
            redis.subClient.subscribe(roomId, (message) => {
                const data = message.toString('utf-8')

                logger.debug('redis received : ' + data)
        
                // 클라이언트로 메시지 전송
                const input = JSON.parse(data)

                logger.debug('server flag : ' + input.server)

                // 서버에서 전송한 것이 돌아온 경우가 아니면 처리
                if (typeof(input.server) == 'undefined') {

                    //const curRoom = roomHash.get(input.userId)
                    const curRoom = 'MO-TEST1'
                    if (typeof(curRoom) != 'undefined') {     
                        io.to(curRoom).emit('message_group', input);

                        logger.debug('sent to room : ' + curRoom)
                    } else {
                        logger.debug('room is not found for user : ' + input.userId)
                    }
            
                }

            }, true);

            logger.debug('redis subscribed -> ' + userId +', ' + roomId);

            redisHash.set(roomId, redis)
            roomList.push(roomId)

            connectRedisCallback(true)
        });

    
        redis.pubClient.on('error', (err) => {
            logger.debug('pubClient error -> ' + err);
        });

        redis.subClient.on('error', (err) => {
            logger.debug('subClient error -> ' + err);
            
            connectRedisCallback(false)
        });
        
    }

    /**
     * Method to handle 'logout_group' event
     */
    async logout_group(io, socket, event, input, namespace, redis) {
        logger.debug('logout_group called. this server namespace -> ' + namespace);
 
        // roomHash에서 룸 정보 삭제
        roomHash.delete(input.userId)

        // 동일한 룸에 연결된 사람이 한 명도 없으면 레디스 구독 해제
        const values = Array.from(roomHash.values());
        if (values.includes(input.roomId)) {
            logger.debug('room exists in roomHash.');
        } else {
            logger.debug('no room exists in roomHash.');

            // 레디스 구독 해제      
            if (typeof(redis) != 'undefined') {       
                redis.subClient.unsubscribe(input.roomId);
                logger.debug('redis unsubscribed -> ' + input.roomId);

                // await Promise.all([
                //     roomRedis.subClient.quit(),
                //     roomRedis.pubClient.quit()
                // ])
                // logger.debug('redis disconnected.');

                redisHash.delete(input.roomId)

                // 룸 리스트에서 삭제
                const roomIndex = roomList.indexOf(input.roomId)
                if (roomIndex > -1) roomList.splice(roomIndex, 1)

            } else {
                logger.debug('user ' + input.roomId + ' is not found in redisHash.');
            }
        }

        socket.leave(input.roomId);

        // send response
        util.sendResponse(io, socket, event, '200', 'logout_group success.', input.roomId);
    };


    /**
     * Method to handle 'message_group' event
     */
    message_group(io, socket, event, input, namespace, redis) {
        logger.debug('message_group called. this server namespace -> ' + namespace);
 

        // 레디스 출판
        //const roomRedis = redisHash.get(input.roomId)
        if (typeof(redis) != 'undefined') {       

           // 서버 -> 레디스 -> 서버로 순환하는 것을 막기 위해 서버 플래그 추가 (subClient에서 메시지 받았을 때 확인)
           input.server = true

           // 레디스로 전송
           redis.pubClient.publish(input.roomId, JSON.stringify(input));
           logger.debug('redis published for room ' + input.roomId + ' -> ' + JSON.stringify(input));
        } else {
           logger.debug('room ' + input.roomId + ' is not found in redisHash.');
        }
 
        io.to(input.roomId).emit(event, input);
    }
    
}

module.exports = GroupChatHandler;

