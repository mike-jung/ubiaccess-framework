/*
 * socket.io loader
 * 
 * @author Mike
 */

'use strict';

const socketio_loader = {};

const config = require('../config/config');
 
// logger
const logger = require('../util/logger');

const redis = require("redis");

// 레디스 수신자 클래스 불러오기
const RedisService = require('./socketio/redis_service');

// 소켓IO 클래스 불러오기
const SocketIOService = require('./socketio/socketio_service');

const redisConfig = config.redis;

let redisService;
let socketIOService;
  

// userId -> Map
const userRequestCodeMap = new Map();
 


socketio_loader.load = async (server, app, sessionMiddleware, socketio, namespace) => {
	logger.debug('socketio_loader::load called.');
    

    try {
    
        // 레디스 수신자 객체 만들기
        redisService = new RedisService(redisConfig, redisConfig.channelNames, redisConfig.pollInterval, onRedisMessageReceived);
     
        // 소켓IO 객체 만들기
        socketIOService = new SocketIOService(server, redisService, onSocketLogin, onSocketLogout, onSocketEventReceived, onSocketAckEventReceived, onSocketDisconnected);

        // app에 등록
        app.redisService = redisService;
        app.socketIOService = socketIOService;

    } catch(err) {
        console.error(`socketio_loader::Error in executing : ${err}`)
    }
     

};
 

///
/// 레디스 메시지 수신 시 자동 호출되는 함수
///
function onRedisMessageReceived(input, channel) {
    logger.debug(`socketio_loader::레디스 메시지 수신함 -> 채널명 : ${channel}, 데이터 : ${JSON.stringify(input)}`);

    if (input.channelType == 'SocketIO') {
 
        // 소켓으로 전송
        if (input.command == 'send') {      // 일대일 전송
            socketIOService.send(input.sender, input.receiver, input);
            
            
            // 맵에 추가 (응답 못받을 경우 재전송용)
            let requestCodeMap = null;
            if (!userRequestCodeMap.has(input.receiver)) {
                requestCodeMap = new Map();
            } else {
                requestCodeMap = userRequestCodeMap.get(input.receiver);
            }
            requestCodeMap.set(input.requestCode, input);
            userRequestCodeMap.set(input.receiver, requestCodeMap);
            

        } else {
            console.error('socketio_loader::알 수 없는 command : ' + input.command);
        }

    } else {

        console.debug(`socketio_loader::알 수 없는 채널 타입 무시함 -> channelType: ${input.channelType}`);

    }

}


///
/// 소켓IO에서 로그인 시 자동 호출되는 함수
///
async function onSocketLogin(socket, inputJson) {
    const input = JSON.parse(inputJson);
    logger.debug('onSocketLogin -> ' + JSON.stringify(input));
     
    // 로그인 과정이 필요함
    const userId = input.id;
    const socketId = socket.id;
    logger.debug(`userid: ${userId}, socketId: ${socketId}`);

    redisService.setSocketMap(userId, socketId);
    logger.debug('redis에 로그인 id를 등록했습니다. : ' + userId + ' -> ' + socketId);

    const output = {
        requestCode: input.requestCode,
        command: input.command,
        id: input.id,
        code: 200,
        message: 'OK'
    }

    socket.emit('response', output);


    // 전송 안된 메시지들을 재전송 (0.1초 후)
    setTimeout(() => {

        const requestCodeMap = userRequestCodeMap.get(input.id);
        if (requestCodeMap) {
            const keys = requestCodeMap.keys();
            for (let key of keys) {
                logger.debug(`retrying to send -> requestCode : ${key}`);
                socket.emit('message', requestCodeMap.get(key));
    
                requestCodeMap.delete(key);
            }
            userRequestCodeMap.set(input.id, requestCodeMap);
        }
        
    }, 100);

}


///
/// 소켓IO 연결 종료 시 자동 호출되는 함수
///
async function onSocketDisconnected(userId, socketId) {
    logger.debug(`onSocketDisconnected -> userId: ${userId}, socketId: ${socketId}`);
    
    // 전송 안된 메시지들 삭제 (0.1초 후)
    setTimeout(() => {

        const requestCodeMap = userRequestCodeMap.get(userId);
        if (requestCodeMap) {
            requestCodeMap.clear();
            userRequestCodeMap.set(userId, requestCodeMap);
        }
        
    }, 100);
    
}


///
/// 소켓IO에서 로그아웃 시 자동 호출되는 함수
///
async function onSocketLogout(socket, inputJson) {
    const input = JSON.parse(inputJson);
    logger.debug('onSocketLogout -> ' + JSON.stringify(input));

    // 레디스에서 사용자 정보 삭제
    const socketId = socket.id;

    let result = null;

    try {
        result = await socketIOService.deleteUserFromRedis(socketId);
            
        const output = {
            requestCode: input.requestCode,
            command: input.command,
            id: input.id,
            code: 200,
            message: 'OK'
        }

        socket.emit('response', output);
        
    } catch(err) {

        const output = {
            requestCode: input.requestCode,
            command: input.command,
            id: input.id,
            code: 400,
            message: err
        }
    
        socket.emit('response', output);

    }

}


///
/// 소켓IO에서 데이터 수신 시 자동 호출되는 함수
///
async function onSocketEventReceived(socket, inputJson) {
    logger.debug(`소켓 메시지 수신함 -> ${inputJson}`);

    const input = JSON.parse(inputJson);
     
    if (input.command == 'poll') {      // 폴링 무시
     
    } else if (input.command == 'send') {      // 일대일 전송
        
        try {
            
            // 채널이 있는지 확인
            if (config.redis.channelNames.indexOf(input.channel) < 0) {
                logger.debug(`등록된 레디스 채널 없음 : ${input.channel}`);
                return;
            }

            // 레디스 송신 (publish)
            await this.redisService.publisher.publish(input.channel, inputJson);
            logger.debug(`송신자가 데이터 보냄 -> 채널 : ${input.channel}`);


            // WebRtc 세션인 경우 처리
            if (input.commandType == 'session') {
                if (input.method == 'invite') {
                    
                    const params = {
                        requestCode: generateRequestCode(),
                        channelType: 'SocketIO',
                        channel: input.channel,
                        command: 'send',
                        commandType: 'session', 
                        userId: input.sender, 
                        sender: input.receiver, 
                        receiver: input.sender, 
                        method: 'trying',
                        code: '110',
                        category: input.category,
                        data: ''
                    }
                    
                    socket.emit('message', params);

                    logger.debug('송신자에게 TRYING 응답보냄.');

                }
            }



            // 응답 전송
            const output = {
                requestCode: input.requestCode,
                command: input.command,
                channel: input.channel,
                sender: input.sender,
                receiver: input.receiver,
                code: 200,
                message: 'OK'
            }
    
            socket.emit('response', output);
            
        } catch(err) {
            console.error(`송신자 전송 중 에러 : ${err}`);

            const output = {
                requestCode: input.requestCode,
                command: input.command,
                channel: input.channel,
                sender: input.sender,
                receiver: input.receiver,
                code: 400,
                message: `송신자 전송 중 에러 : ${err}`
            }
        
            socket.emit('response', output);

        }

    } else {
        logger.debug('알 수 없는 command : ' + input.command);
    }

}



///
/// 소켓IO에서 데이터 수신 시 자동 호출되는 함수
///
async function onSocketAckEventReceived(socket, inputJson) {
    logger.debug(`소켓 ACK 메시지 수신함 -> ${inputJson}`);

    const input = JSON.parse(inputJson);
     
    if (input.command == 'ack') {      // 수신자로부터의 ack
        
        try {
            
            // 응답으로 받은 전송코드라면 전송안된 데이터에서 삭제하기 (재전송 여부 판단용)
            const requestCodeMap = userRequestCodeMap.get(input.receiver);
            if (requestCodeMap) {
                if (requestCodeMap.size > 100) { // 100개가 넘으면 모두 삭제
                    requestCodeMap.clear();
                }
                requestCodeMap.delete(input.requestCode);
                userRequestCodeMap.set(input.receiver, requestCodeMap);
            }
            
        } catch(err) {
            console.error(`Error -> ${err}`);
        }
    
    } else {
        logger.debug('알 수 없는 command : ' + input.command);
    }

}


//===== 요청 코드 =====//

let seqCode = 0;
 
///
/// 요청 코드 생성
///
function generateRequestCode() {
    const date = new Date();

    const seqCodeStr = getSeqCode();

    const components = [
        date.getFullYear(),
        ("0" + (date.getMonth() + 1)).slice(-2),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
        seqCodeStr
    ];

    const curCode = components.join("");
    return curCode;
}

/// 
/// 시퀀스 코드 (01 ~ 99)
///
function getSeqCode() {
    seqCode += 1;
    if (seqCode > 99) {
        seqCode = 0;
    }
    let seqCodeStr = String(seqCode);
    if (seqCodeStr.length == 1) {
        seqCodeStr = '0' + seqCodeStr;
    }

    return seqCodeStr;
}



module.exports = socketio_loader;

