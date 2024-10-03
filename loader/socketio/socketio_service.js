///
/// 레디스 수신자를 만들어 연결한 후 수신함
///

 
const { Server } = require('socket.io');
      
// logger
const logger = require('../../util/logger');

///
/// 레디스 수신자 클래스
///
class SocketIOService {
 
    constructor(server, redisService, onLogin, onLogout, onEventReceived, onAckEventReceived, onDisconnected) {
        
        // 네임스페이스
        this.namespace = '';

        this.redisService = redisService;

        // 콜백함수 등록
        this.onLogin = onLogin;
        this.onLogout = onLogout;
        this.onEventReceived = onEventReceived;
        this.onAckEventReceived = onAckEventReceived;
        this.onDisconnected = onDisconnected;

        // 초기화
        this.io = null;

        this.initServer(server);

    }
            
    initServer(server) {
  
        this.io = new Server(server, 
            {
                pingInterval: 10000,
                pingTimeout: 5000,
                transports: [
                    'websocket'
                ]
            }
        );

        this.io.path("/chat/");
        this.io.attach(server);

        logger.debug('socket.io ready.');
        
        this.registerHandler();

    }


    registerHandler() {

        ///
        /// 클라이언트 소켓이 연결되었을 때 처리
        /// 
        this.io.on('connection', async (socket) => {
            logger.debug('connection -> ' + JSON.stringify(socket.request.connection._peername));
            //logger.debug('socket id -> ' + socket.id);
            
            //logger.debug(`sockets size : ${this.io.of('/').sockets.size}`)

            const sockets = await this.io.of('/').adapter.sockets(new Set());
            //logger.debug(`connected sockets : ${Array.from(sockets).join(' ')}`);


            socket.on('poll', (inputJson) => {
                //const input = JSON.parse(inputJson);
                //logger.debug(`폴링 수신함 -> requestCode: ${input.requestCode}, sender: ${input.sender}`);
            });

            socket.on('login', (inputJson) => {
                this.onLogin(socket, inputJson);
            });
             
            socket.on('logout', (inputJson) => {
                this.onLogout(socket, inputJson);
            });

            socket.on('message', (inputJson) => {
                this.onEventReceived(socket, inputJson);
            });

            socket.on('ack', (inputJson) => {
                this.onAckEventReceived(socket, inputJson);
            });


            /// 클라이언트 소켓이 끊어졌을 때 처리
            socket.on('disconnect', async (reason) => {
                logger.debug(`disconnect reason : ${reason}`);
                //logger.debug('socket id -> ' + socket.id);
            
                try {
                    // 레디스에서 소켓ID로 사용자ID 확인
                    const userId = await this.redisService.storeClient.hGet('socket-user', socket.id);
                        
                    // 레디스에서 사용자ID로 삭제
                    if (userId) {
                        this.onDisconnected(userId, socket.id);
                    }

                } catch(err) {
                    console.log(`Error in checking user id from redis using socket id : ${err}`);
                }

                //logger.debug(`sockets size : ${this.io.of('/').sockets.size}`);

                try {
                    const connectedSockets = await this.io.of('/').adapter.sockets(new Set());
                    const connectedSocketArray = Array.from(connectedSockets);
                    //logger.debug(`connected sockets : ${connectedSocketArray.join(' ')}`);

                    let countUserSocket = await this.redisService.storeClient.hLen('user-socket');
                    //logger.debug(`count of user-socket : ${countUserSocket}`);

                    let items1 = await this.redisService.storeClient.hGetAll('user-socket');
                    //logger.debug(`all user-socket : ${JSON.stringify(items1)}`);


                    let countSocketUser = await this.redisService.storeClient.hLen('socket-user');
                    //logger.debug(`count of socket-user : ${countSocketUser}`);

                    let items2 = await this.redisService.storeClient.hGetAll('socket-user');
                    //logger.debug(`all socket-user : ${JSON.stringify(items2)}`);

                
                    // 레디스에서 사용자 정보 삭제
                    const socketId = socket.id;
                    await this.deleteUserFromRedis(socketId);

                    
                    // 연결이 끊어진 소켓 정보는 레디스에서 제거
                    const socketKeys = Object.keys(items2);
                    let index = 0;
                    for (let socketKey of socketKeys) {
                        //logger.debug(`socketKey #${index} : ${socketKey}`);

                        if (connectedSocketArray.indexOf(socketKey) > -1) {
                            //logger.debug(`socketKey found.`);
                        } else {
                            //logger.debug(`socketKey not found. deleting.`);

                            await this.redisService.storeClient.hDel('socket-user', socketKey);
                        }

                        index += 1;
                    }


                    countUserSocket = await this.redisService.storeClient.hLen('user-socket');
                    //logger.debug(`final count of user-socket : ${countUserSocket}`);

                    items1 = await this.redisService.storeClient.hGetAll('user-socket');
                    //logger.debug(`final all user-socket : ${JSON.stringify(items1)}`);

                    countSocketUser = await this.redisService.storeClient.hLen('socket-user');
                    //logger.debug(`final count of socket-user : ${countSocketUser}`);

                    items2 = await this.redisService.storeClient.hGetAll('socket-user');
                    //logger.debug(`final all socket-user : ${JSON.stringify(items2)}`);

                } catch(err) {
                    logger.debug(`Error in getting or deleting user info from redis : ${err}`);
                }


            })

        })

    }

    async deleteUserFromRedis(socketId) {
        
        return new Promise(async (resolve, reject) => {

            try {
                // 레디스에서 소켓ID로 사용자ID 확인
                const userId = await this.redisService.storeClient.hGet('socket-user', socketId);
    
                // 레디스에서 사용자ID로 삭제
                if (userId) {
                    await this.redisService.storeClient.hDel('user-socket', userId);
                    //logger.debug(`redis hDel success for userId -> ${userId}`);
                } else {
                    console.error(`User not found for socketId -> ${socketId}`);

                    reject(`User not found for socketId -> ${socketId}`);
                    return;
                }
     
                // 레디스에서 소켓ID로 삭제
                await this.redisService.storeClient.hDel('socket-user', socketId);
                //logger.debug(`redis hDel success for socketId -> ${socketId}`);
    
                resolve('OK');

            } catch(err) {
                logger.debug(`Error in deleting socketId from redis -> ${err}`);

                reject(`Error in deleting socketId from redis -> ${err}`)
            }
    
        })
        
    }



    ///
    /// 수신자에게 메시지 전송
    ///
    async send(senderId, receiverId, input) {
        //logger.debug('send called. receiverId : ' + receiverId);

        // redis에서 매핑 값 가져오기
        try {
            const socketId = await this.redisService.storeClient.hGet('user-socket', receiverId)  
            //logger.debug('found socketId : ' + socketId);

            if (socketId) {
                //logger.debug('redis에서 가져온 값 : ' + receiverId + ' -> ' + socketId)

                this.io.of('/').to(socketId).emit('message', input);
                //logger.debug(`클라이언트로 전송됨 : ${senderId} -> ${receiverId}`)
            } else {
                logger.debug('socket id is not found')
            }
        } catch(err) {
            logger.debug('redis에서 값을 가져오는 중 에러 : ' + err)
            return
        }

    }


}

module.exports = SocketIOService;
