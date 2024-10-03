/**
 * Simple configuration for the server and database.
 * MySQL(or MariaDB) database connection is needed.
 * 
 * @author Mike
 */

module.exports = {
    server: {
        port: 8001,
        https: false 
    },
    database: {  
        database_mysql: { 
            type: 'mysql',
            failover: 'true',
            retryStrategy: {
                interval: 2000,
                limit: 3,
                failoverLimit: 3
            },
            master: {
                host:'localhost',
                port:3306,
                user:'root',
                password:'admin',
                database:'test',
                connectionLimit:10,
                debug:false
            },
            slave: {
                host:'localhost',
                port:3306,
                user:'root',
                password:'admin',
                database:'test',
                connectionLimit:10,
                debug:false
            }
        }
    },
    redis: {
        failover: false,
        name: 'ubiaccess',
        host:'localhost', 
        port: 6379,
        socket: {
            host:'localhost', 
            port: 6379,
            connectTimeout: 5000,
            keepAlive: true,
            reconnectStrategy: retries => Math.min(retries * 1000, 60000)
        },
        channelNames: [
            'CH_01'
        ],
        pollInterval: 10 * 1000
    },
    socketio: {
        active: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: [
		    'websocket'
		]
    } 
}