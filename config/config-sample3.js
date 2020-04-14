/**
 * Configuration sample for more complex one
 * 
 * @author Mike
 */

module.exports = {
    server: {
        host: '192.168.0.4',
        port: 8001,
        backlog: 50000,
        https: false
    },
    database: {  
        database_mysql: { 
            type: 'mysql',
            failover: true,
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
                port:4407,
                user:'root',
                password:'',
                database:'test',
                connectionLimit:10,
                debug:false
            }
        },
        database_sqlite: {                  // SQLite database configuration
            type: 'sqlite',
            replication: true,
            failover: true,
            retryStrategy: {
                interval: 2000,
                limit: 3,
                failoverLimit: 3
            },
            master: {
                host:'localhost',
                port:8001,
                file: './database/customer.db'
            },
            slave: {
                host:'localhost',
                port:8002,
                file: './database/customer2.db'
            }
        }
    },
    external: [                             // external interfaces
        {                                   // #0 test interface for socket outbound
            name: 'external01',
            protocol: 'socket', 
            direction: 'outbound',
            host: 'localhost',
            port: 7101,
            connectionLimit: 10,
            acquireTimeout: 10000,
            connectTimeout: 10000
        },
        {                                   // #1 test interface for http outbound
            name: 'external02',
            protocol: 'http', 
            direction: 'outbound',
            host: 'localhost',
            port: 7102
        }
    ],
    redis: {                                // redis with failover using sentinels
        failover: true,
        sentinels: [
            { host:'127.0.0.1', port: 11425 },
            { host:'127.0.0.1', port: 11426 },
            { host:'127.0.0.1', port: 11427 }
        ],
        name: 'mymaster'
    },
    socketio: {                             // socket.io configuration
        active: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: [
		    'websocket'
		]
    },
    gcm_api_key:'Set_this_key_using_console.firebase.google.com_site!'
}