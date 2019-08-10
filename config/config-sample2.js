/**
 * Configuration sample for more complex one
 * 
 * @author Mike
 */

module.exports = {
    server: {
        host: '192.168.0.4',
        port: 7001,
        backlog: 50000,
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
            replication: 'true',
            failover: 'true',
            retryStrategy: {
                interval: 2000,
                limit: 3,
                failoverLimit: 3
            },
            master: {
                host:'localhost',
                port:7001,
                file: './database/customer.db'
            },
            slave: {
                host:'localhost',
                port:7002,
                file: './database/customer2.db'
            }
        }
    },
    redis: {
        sentinels: [
            { host:'127.0.0.1', port: 11425 },
            { host:'127.0.0.1', port: 11426 },
            { host:'127.0.0.1', port: 11427 }
        ],
        name: 'mymaster'
    },
    socketio: {
        active: true
    }
    
}