///
/// 레디스 수신자를 만들어 연결한 후 수신함
///

 
const { Server } = require('socket.io');
      
 

///
/// 레디스 수신자 클래스
///
class SocketIOService {
 
    constructor(server, redisService, onLogin, onLogout, onEventReceived, onAckEventReceived) {
        
        // 네임스페이스
        this.namespace = '';

        this.redisService = redisService;

        // 콜백함수 등록
        this.onLogin = onLogin;
        this.onLogout = onLogout;
        this.onEventReceived = onEventReceived;
        this.onAckEventReceived = onAckEventReceived;

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

        console.log('socket.io ready.');
        
        this.registerHandler();

    }


    registerHandler() {

        ///
        /// 클라이언트 소켓이 연결되었을 때 처리
        /// 
        this.io.on('connection', async (socket) => {
            console.log('connection -> ' + JSON.stringify(socket.request.connection._peername));
            //console.log('socket id -> ' + socket.id);
            
            //console.log(`sockets size : ${this.io.of('/').sockets.size}`)

            const sockets = await this.io.of('/').adapter.sockets(new Set());
            //console.log(`connected sockets : ${Array.from(sockets).join(' ')}`);


            socket.on('poll', (inputJson) => {
                //const input = JSON.parse(inputJson);
                //console.log(`폴링 수신함 -> requestCode: ${input.requestCode}, sender: ${input.sender}`);
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
                console.log(`disconnect reason : ${reason}`);
                //console.log('socket id -> ' + socket.id);
            
                //console.log(`sockets size : ${this.io.of('/').sockets.size}`);

                try {
                    const connectedSockets = await this.io.of('/').adapter.sockets(new Set());
                    const connectedSocketArray = Array.from(connectedSockets);
                    //console.log(`connected sockets : ${connectedSocketArray.join(' ')}`);

                    let countUserSocket = await this.redisService.storeClient.hLen('user-socket');
                    //console.log(`count of user-socket : ${countUserSocket}`);

                    let items1 = await this.redisService.storeClient.hGetAll('user-socket');
                    //console.log(`all user-socket : ${JSON.stringify(items1)}`);


                    let countSocketUser = await this.redisService.storeClient.hLen('socket-user');
                    //console.log(`count of socket-user : ${countSocketUser}`);

                    let items2 = await this.redisService.storeClient.hGetAll('socket-user');
                    //console.log(`all socket-user : ${JSON.stringify(items2)}`);

                
                    // 레디스에서 사용자 정보 삭제
                    const socketId = socket.id;
                    await this.deleteUserFromRedis(socketId);

                    
                    // 연결이 끊어진 소켓 정보는 레디스에서 제거
                    const socketKeys = Object.keys(items2);
                    let index = 0;
                    for (let socketKey of socketKeys) {
                        //console.log(`socketKey #${index} : ${socketKey}`);

                        if (connectedSocketArray.indexOf(socketKey) > -1) {
                            //console.log(`socketKey found.`);
                        } else {
                            //console.log(`socketKey not found. deleting.`);

                            await this.redisService.storeClient.hDel('socket-user', socketKey);
                        }

                        index += 1;
                    }


                    countUserSocket = await this.redisService.storeClient.hLen('user-socket');
                    //console.log(`final count of user-socket : ${countUserSocket}`);

                    items1 = await this.redisService.storeClient.hGetAll('user-socket');
                    //console.log(`final all user-socket : ${JSON.stringify(items1)}`);

                    countSocketUser = await this.redisService.storeClient.hLen('socket-user');
                    //console.log(`final count of socket-user : ${countSocketUser}`);

                    items2 = await this.redisService.storeClient.hGetAll('socket-user');
                    //console.log(`final all socket-user : ${JSON.stringify(items2)}`);

                } catch(err) {
                    console.log(`Error in getting or deleting user info from redis : ${err}`);
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
                    //console.log(`redis hDel success for userId -> ${userId}`);
                } else {
                    console.error(`User not found for socketId -> ${socketId}`);

                    reject(`User not found for socketId -> ${socketId}`);
                    return;
                }
     
                // 레디스에서 소켓ID로 삭제
                await this.redisService.storeClient.hDel('socket-user', socketId);
                //console.log(`redis hDel success for socketId -> ${socketId}`);
    
                resolve('OK');

            } catch(err) {
                console.log(`Error in deleting socketId from redis -> ${err}`);

                reject(`Error in deleting socketId from redis -> ${err}`)
            }
    
        })
        
    }



    ///
    /// 수신자에게 메시지 전송
    ///
    async send(senderId, receiverId, input) {
        //console.log('send called. receiverId : ' + receiverId);

        // redis에서 매핑 값 가져오기
        try {
            const socketId = await this.redisService.storeClient.hGet('user-socket', receiverId)  
            //console.log('found socketId : ' + socketId);

            if (socketId) {
                //console.log('redis에서 가져온 값 : ' + receiverId + ' -> ' + socketId)

                this.io.of('/').to(socketId).emit('message', input);
                //console.log(`클라이언트로 전송됨 : ${senderId} -> ${receiverId}`)
            } else {
                console.log('socket id is not found')
            }
        } catch(err) {
            console.log('redis에서 값을 가져오는 중 에러 : ' + err)
            return
        }

    }


}

module.exports = SocketIOService;
