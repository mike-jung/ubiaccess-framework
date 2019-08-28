'use strict';

import mysql from 'mysql';
import mysqlUtilities from 'mysql-utilities';

import path from 'path';
import fs from 'fs';

import config from'../config/config';
import sqlConfig from'../config/sql_config';
import logger from '../util/logger';
 
const dbName = 'database_mysql';
let isMaster = true;
let failoverCount = 0;
let isFailovering = false;
let pool = null;

const getPool = () => {
    console.log('getPool called.');

    if (isMaster) {
        pool = mysql.createPool(config.database[dbName].master);
    } else {
        pool = mysql.createPool(config.database[dbName].slave);
    }
}

getPool();
console.log('database_mysql file loaded.');

const sqlDir = __dirname + '\\..\\..\\database\\sql';
let sqlObj = {};

const loadSql = () => {
    console.log('loadSql called.');

    // check all sql files
    fs.readdir(sqlDir, (err, filenames) => {
        if (err) {
            console.log('Unable to scan sql directory: ' + err);
            return;
        } 

        // listing all filenames
        filenames.forEach((filename) => {
            const filePath = path.join(sqlDir, filename);
            console.log('sql file path -> ' + filePath);

            const curObj = require(filePath);
            Object.assign(sqlObj, curObj);
        });

        const sqlNames = Object.keys(sqlObj);
        console.log('SQL count -> ' + sqlNames.length);
        console.log('SQL names -> ' + sqlNames.join());

        console.log('database SQL file loaded.');
    });

}

loadSql();



class DatabaseMySQL {

    constructor(dbName) {

    }
 
    execute(sqlName, params) {
        return new Promise((resolve, reject) => {
            // check SQL definition
            if (!sqlConfig[sqlName] && !sqlObj[sqlName]) {
                reject(`Sql definition for ${sqlName} not found in sql_config`);
            }

            let curSqlObj;
            if (sqlConfig[sqlName]) {
                curSqlObj = sqlConfig[sqlName];
            } else if (sqlObj[sqlName]) {
                curSqlObj = sqlObj[sqlName];
            }

            let sql = curSqlObj.sql;

            let sqlParams = [];
            curSqlObj.params.forEach((item, index) => {
                sqlParams.push(params[item]);
            })

            this.executeRaw(sql, sqlParams, 0, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    executeSql(sqlName, params, callback) {
        // check SQL definition
        if (!sqlConfig[sqlName] && !sqlObj[sqlName]) {
            callback(new Error(`Sql definition for ${sqlName} not found in sql_config`), null);
            return;
        }
        
        let curSqlObj;
        if (sqlConfig[sqlName]) {
            curSqlObj = sqlConfig[sqlName];
        } else if (sqlObj[sqlName]) {
            curSqlObj = sqlObj[sqlName];
        }

        let sql = curSqlObj.sql;

        let sqlParams = [];
        curSqlObj.params.forEach((item, index) => {
            sqlParams.push(params[item]);
        })

        this.executeRaw(sql, sqlParams, 0, callback);
    }


    // query sql statement
    query(sql, sqlParams) {
        return new Promise((resolve, reject) => {
            this.executeRaw(sql, sqlParams, 0, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    // query sql statement with callback
    querySql(sql, sqlParams, callback) {
        this.executeRaw(sql, sqlParams, 0, callback);
    }


    executeRaw(sql, sqlParams, retryCount, callback) {
        
        pool.getConnection((err, conn) => {

            if (err) {
                console.log('Error in fetching database connection -> ' + err);
                
                if (err.code === 'ECONNREFUSED') {
                    retryCount += 1;
                    console.log('retryCount : ' + retryCount + '/' + config.database[dbName].retryStrategy.limit);

                    if (retryCount < config.database[dbName].retryStrategy.limit) {
                        console.log('Retrying #' + retryCount);
                        
                        if (failoverCount > config.database[dbName].retryStrategy.failoverLimit) {
                            callback(err, null);
                        } else {
                            this.executeRaw(sql, sqlParams, retryCount, callback);
                        }
                    } else {
                        if (!isFailovering) {
                            isFailovering = true;

                            // change database config
                            setTimeout(() => {
                                if (isMaster) {
                                    // only if config.slave exists
                                    if (config.database[dbName].slave) {
                                        isMaster = false;
                                    }
                                } else {
                                    isMaster = true;
                                }
            
                                pool.end(() => {
                                    console.log('existing pool ended.');
 
                                    getPool();
                                    console.log('database connection pool is failovered to ');
                                    if (isMaster) {
                                        console.log('master config -> ' + config.database[dbName].master.host + ':' + config.database[dbName].master.port);
                                    } else {
                                        console.log('slave config -> ' + config.database[dbName].slave.host + ':' + config.database[dbName].slave.port);
                                    }

                                    failoverCount += 1;
                                    console.log('failoverCount : ' + failoverCount + '/' + config.database[dbName].retryStrategy.failoverLimit);

                                    if (failoverCount > config.database[dbName].retryStrategy.failoverLimit) {
                                        callback(err, null);
                                    } else {
                                        isFailovering = false;

                                        const newRetryCount = 0;
                                        this.executeRaw(sql, sqlParams, newRetryCount, callback);
                                    }
                                });

                            }, config.database[dbName].retryStrategy.interval);
                            
                        }

                    }
                } else {
                    callback(err, null);
                }

                return;
            }

            const query = conn.query(sql, sqlParams, (err, rows) => {
                if (conn) {
                    conn.release();
                }

                console.log('SQL -> ' + query.sql);

                if (err) {
                    console.log('Error in executing SQL -> ' + err);
                    callback(err, null);
                    return;
                }
        
                callback(null, rows);
            });

        });
    }


    // fetch fields metadata
    fields(tableName) {
        return new Promise((resolve, reject) => {
            this.fieldsRaw(tableName, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    fieldsRaw(tableName, callback) {
        
        pool.getConnection((err, conn) => {

            if (err) {
                console.log('Error in fetching database connection -> ' + err);
                callback(err, null);

                return;
            }

            mysqlUtilities.upgrade(conn);
            mysqlUtilities.introspection(conn);

            conn.fields(tableName, (err, fields) => {
                if (conn) {
                    conn.release();
                }

                if (err) {
                    console.log('Error in fetching fields -> ' + err);
                    callback(err, null);
                    return;
                }

                callback(null, fields);
            });
 
        });
    }


}

module.exports = DatabaseMySQL;
