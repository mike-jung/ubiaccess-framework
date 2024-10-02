///
/// 레디스 수신자를 만들어 연결한 후 수신함
///

const redis = require("redis");


///
/// 레디스 수신자 클래스
///
class RedisService {
 
    constructor(redisConfig, channelNames, pollInterval, callback) {
        this.redisConfig = redisConfig;
        this.channelNames = channelNames;
        this.pollInterval = pollInterval;

        this.callback = callback;

        this.storeClientInterval = null;
        this.subscriberInterval = null;
        this.publisherInterval = null;

        this.storeClientPollingCount = 0;
        this.subscriberPollingCount = 0;
        this.publisherPollingCount = 0;

        this.storeClient = null;
        this.subscriber = null;
        this.publisher = null;

        // 초기화
        this.initRedisClient();

    }
        
    ///
    /// 수신자 만들고 설정하기
    ///
    async initRedisClient() {
        //console.log(`redisConfig -> ${JSON.stringify(this.redisConfig)}`);

        try {
            
            // 저장 클라이언트 만들기
            this.createStoreClient();

            // 수신자 만들기
            this.createSubscriber();

            // 송신자 만들기
            this.createPublisher();

            // 채널 유지를 위해 수신자에서 주기적으로 폴링 (10초)
            this.startRedisPolling();

        } catch(err) {
            console.error(`Error -> ${err}`);
        }
        
    }


    ///
    /// 저장 클라이언트 만들기
    ///
    async createStoreClient() {
        
        try {

            // 클라이언트 객체 만들기
            this.storeClient = redis.createClient(this.redisConfig);
                    
            // 수신자 에러 처리
            this.storeClient.on('error', this.onStoreClientError);

            // 수신자 연결하기
            await this.storeClient.connect();
            //console.log(`레디스 저장 클라이언트 연결됨 -> 서버 설정 : ${JSON.stringify(this.redisConfig)}`);

        } catch(err) {
            console.error(`Error -> ${err}`);
        }

    }


    ///
    /// 수신자 만들기
    ///
    async createSubscriber() {

        try {

            // 수신자 객체 만들기
            const redisClient = redis.createClient(this.redisConfig);
            this.subscriber = redisClient.duplicate();

            // 수신자 에러 처리
            this.subscriber.on('error', this.onSubscriberError);

            // 수신자 연결하기
            await this.subscriber.connect();
            //console.log(`레디스 수신자 연결됨 -> 서버 설정 : ${JSON.stringify(this.redisConfig)}`);

            // 수신자 구독하기
            for (let channel of this.channelNames) {
                await this.subscriber.subscribe(channel, this.onMessageReceived.bind(this));
                //console.log(`레디스 수신자 구독함 -> 채널명 : ${channel}`);
            }

        } catch(err) {
            console.error(`Error -> ${err}`);
        }

    }
    

    ///
    /// 송신자 만들기
    ///
    async createPublisher() {

        try {

            // 송신자 객체 만들기
            const redisClient = redis.createClient(this.redisConfig);
            this.publisher = redisClient.duplicate();

            // 송신자 에러 처리
            this.publisher.on('error', this.onPublisherError);

            // 송신자 연결하기
            await this.publisher.connect();
            //console.log(`레디스 송신자 연결됨 -> 서버 설정 : ${JSON.stringify(this.redisConfig)}`);
 
        } catch(err) {
            console.error(`Error -> ${err}`);
        }

    }
    

    ///
    /// 저장 클라이언트에서 에러 발생 시 호출되는 함수
    ///
    onStoreClientError(err, channel) {
        console.error(`레디스 저장 클라이언트 에러 -> 채널명 : ${channel}, 에러 : ${err}`);
    }

    ///
    /// 수신자에서 에러 발생 시 호출되는 함수
    ///
    onSubscriberError(err, channel) {
        console.error(`레디스 수신자 에러 -> 채널명 : ${channel}, 에러 : ${err}`);
    }

    ///
    /// 송신자에서 에러 발생 시 호출되는 함수
    ///
    onPublisherError(err, channel) {
        console.error(`레디스 송신자 에러 -> 채널명 : ${channel}, 에러 : ${err}`);
    }

    ///
    /// 채널 유지를 위해 클라이언트에서 주기적으로 폴링 (10초)
    ///
    startRedisPolling() {
        
        // 채널 유지를 위해 주기적으로 폴링 (10초)
        this.storeClientInterval = setInterval(() => {
            this.storeClient.ping();
            //console.log(`저장 클라이언트 폴링 #${this.storeClientPollingCount}`);

            this.storeClientPollingCount += 1;
        }, this.pollInterval)

        this.subscriberInterval = setInterval(() => {
            this.subscriber.ping();
            //console.log(`수신자 폴링 #${this.subscriberPollingCount}`);

            this.subscriberPollingCount += 1;
        }, this.pollInterval)
        
        this.publisherInterval = setInterval(() => {
            this.publisher.ping();
            //console.log(`송신자 폴링 #${this.publisherPollingCount}`);

            this.publisherPollingCount += 1;
        }, this.pollInterval)
        
    }


    ///
    /// 수신자에서 메시지 수신 시 호출되는 함수
    ///
    onMessageReceived(inputJson, channel) {
        //console.log(`RedisService::onMessageReceived called -> channel : ${channel}, data -> ${inputJson}`);

        const input = JSON.parse(inputJson);

        if (this.callback) {
            this.callback(input, channel);
        }

    }


    async stopSubscriber() {
        //console.log(`stopSubscriber called.`)

        try {

            clearInterval(storeClientInterval);
            await this.storeClient.disconnect();

            clearInterval(subscriberInterval);

            for (let channel of this.channelNames) {
                await this.subscriber.unsubscribe(channel);
            }

            await this.subscriber.disconnect();
            
            clearInterval(publisherInterval);
            await this.publisher.disconnect();

        } catch(err) {
            //console.error(`Error -> ${err}`);
        }

    }

    ///
    /// 소켓IO의 사용자 ID -> 소켓 ID 매핑
    ///
    async setSocketMap(userId, socketId) {

        try {
 
            await this.storeClient.hSet('socket-user', socketId, userId);
            //console.log(`레디스에 소켓 아이디 to 사용자 아이디를 저장했습니다 -> socketId : ${socketId}, userId : ${userId}`);

            await this.storeClient.hSet('user-socket', userId, socketId);
            //console.log(`레디스에 사용자 아이디 to 소켓 아이디를 저장했습니다 -> userId : ${userId}, socketId : ${socketId}`);
 
        } catch(err) {
            console.error(`Error -> ${err}`);
        }

    }
 
}

module.exports = RedisService;
