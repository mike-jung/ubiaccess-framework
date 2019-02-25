module.exports = {
    server: {
        port: 7001
    },
    database: {
        type:'mysql',
        host:'localhost',
        port:3306,
        user:'root',
        password:'admin',
        database:'test',
        connectionLimit:10,
        debug:false
    }
}