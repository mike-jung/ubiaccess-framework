var SocketPool = require('./SocketPool');

var connPool = SocketPool.createPool({
    connectionLimit : 10, 
    host     : '127.0.0.1',
    port     : 7001,
    debug    :  false
});


function send(pool, data, callback) {
    console.log('send 호출됨.');
    
    // 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
            callback(err, null);
            
            return;
        } 
        
        // 데이터 전송
        console.log('about to send data.');
        conn._socket.write(data);
        callback(null, 'data sent.');
        
    },
    function(conn, event, received) {
        console.log('received event : ' + event);
        console.log('received data : ' + received);
        
        

        try {
            console.log('all connections before release : ' + pool._allConnections.length);
            console.log('free connections before release : ' + pool._freeConnections.length);
            
            conn.release();
            
            console.log('all connections after release : ' + pool._allConnections.length);
            console.log('free connections after release : ' + pool._freeConnections.length);
            
        } catch(err) {
            console.log('error in releasing connection -> ' + JSON.stringify(err));
        }
        
        
    });
    
}

send(connPool, '0000000005Hello', function(err, data) {
    if (err) {
        console.log('error occurred -> ' + JSON.stringify(err));
        
        return;
    }
    
    console.log(data);
    
});

