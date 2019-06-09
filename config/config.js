module.exports = {
    server: {
        port: 7001
    },
    database: {                                 // database array
        database_mysql: {                                       // #0 test database for MySQL
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
        database_sqlite: {                                       // #1 test database for SQLite
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
        active: false
    }
    
}