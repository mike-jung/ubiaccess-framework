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
        database_sqlite: { 
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
    redis: {
        failover: false,
        host:'127.0.0.1', 
        port: 10425,
        name: 'mymaster'
    },
    socketio: {
        active: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: [
		    'websocket'
		]
    },
    gcm_api_key:'Set_this_key_using_console.firebase.google.com_site!'
}