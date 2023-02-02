'use strict';

const mysql = require('mysql');
const mysqlUtilities = require('mysql-utilities');

const path = require('path');
const fs = require('fs');

const config = require('../config/config');
const sqlConfig = require('../config/sql_config');
const logger = require('../util/logger');
const util = require('../util/util');
 


const dbName = 'database_mysql';
let isMaster = true;
let failoverCount = 0;
let isFailovering = false;
let pool = null;

const getPool = () => {
    //logger.debug('getPool called.');

    if (isMaster) {
        pool = mysql.createPool(config.database[dbName].master);
    } else {
        pool = mysql.createPool(config.database[dbName].slave);
    }
}

getPool();
//logger.debug('database_mysql file loaded.');

const sqlDir = __dirname + '/sql';
let sqlObj = {};

const loadSql = () => {
    //logger.debug('loadSql called.');

    // check all sql files
    fs.readdir(sqlDir, (err, filenames) => {
        if (err) {
            logger.debug('Unable to scan sql directory: ' + err);
            return;
        } 

        // listing all filenames
        filenames.forEach((filename) => {
            const filePath = sqlDir + '/' + filename;
            //logger.debug('sql file path -> ' + filePath);

            const curObj = require(filePath);
            Object.assign(sqlObj, curObj);
        });

        const sqlNames = Object.keys(sqlObj);
        //logger.debug('SQL count -> ' + sqlNames.length);
        //logger.debug('SQL names -> ' + sqlNames.join());

        logger.debug('database SQL file loaded.');
    });

}

loadSql();


//replaceAll prototype 선언
String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}


const changeColonToUpperCase = (sql) => {
    let beginIndex = -1;
    let endIndex = -1;
    let curWord = '';
    
    let newSql = sql;

    for (let i = 0; i < sql.length; i++) {
        const curChar = sql[i];
        if (curChar == ':') {
            // :% 인 경우 제외
            if (sql[i+1] && sql[i+1] == '%') {

            } else {
                beginIndex = i;
            }
        }

        if (beginIndex > -1) {
            if (curChar == ' ' || curChar == ',' || curChar == ')') {
                endIndex = i;

                const curToken = curWord.toUpperCase();
                newSql = newSql.replace(curWord, curToken);

                beginIndex = -1;
                endIndex = -1;
                curWord = '';
            } else {
                curWord += curChar;
            }
        } 
    }

    // in case of last word
    if (beginIndex > -1) {
        const curToken = curWord.toUpperCase();
        newSql = newSql.replace(curWord, curToken);
    }

    //logger.debug('colon param to upper case -> ' + newSql);
    
    return newSql;
}                




class DatabaseMySQL {

    constructor(dbName) {

    }
 
    execute(queryParams) {
        const sqlName = queryParams.sqlName;
        const params = queryParams.params;

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
            if (curSqlObj.params) {
                curSqlObj.params.forEach((item, index) => {
                    sqlParams.push(params[item]);
                })
            }

            queryParams.sql = sql;
            queryParams.sqlParams = sqlParams;

            this.executeRaw(queryParams, 0, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    executeSql(queryParams, callback) {
        const sqlName = queryParams.sqlName;
        const params = queryParams.params;

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
        if (curSqlObj.params) {
            curSqlObj.params.forEach((item, index) => {
                sqlParams.push(params[item]);
            })
        }

        queryParams.sql = sql;
        queryParams.sqlParams = sqlParams;
         
        this.executeRaw(queryParams, 0, callback);
    }


    // query sql statement
    query(queryParams) {
        return new Promise((resolve, reject) => {
            this.executeRaw(queryParams, 0, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }
 

    executeRaw(executeParams, retryCount, callback) {
        //logger.debug('executeRaw called.');
        
        const executeParamsText = JSON.stringify(executeParams);
        if (executeParamsText && executeParamsText.length < 1000) {
            //logger.debug('Execute Params -> ' + executeParamsText);
        } else {
            //logger.debug('Execute Params -> over 1000 characters.');
        }

        const sqlName = executeParams.sqlName;
        let sql = executeParams.sql;
        let sqlParams = executeParams.sqlParams;
        let paramType = executeParams.paramType;
        const mapper = executeParams.mapper;
        
        pool.getConnection((err, conn) => {

            if (err) {
                logger.debug('Error in fetching database connection -> ' + err);
                
                if (err.code === 'ECONNREFUSED') {
                    retryCount += 1;
                    logger.debug('retryCount : ' + retryCount + '/' + config.database[dbName].retryStrategy.limit);

                    if (retryCount < config.database[dbName].retryStrategy.limit) {
                        logger.debug('Retrying #' + retryCount);
                        
                        if (failoverCount > config.database[dbName].retryStrategy.failoverLimit) {
                            callback(err, null);
                        } else {
                            this.executeRaw(executeParams, retryCount, callback);
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
                                    logger.debug('existing pool ended.');
 
                                    getPool();
                                    logger.debug('database connection pool is failovered to ');
                                    if (isMaster) {
                                        logger.debug('master config -> ' + config.database[dbName].master.host + ':' + config.database[dbName].master.port);
                                    } else {
                                        logger.debug('slave config -> ' + config.database[dbName].slave.host + ':' + config.database[dbName].slave.port);
                                    }

                                    failoverCount += 1;
                                    logger.debug('failoverCount : ' + failoverCount + '/' + config.database[dbName].retryStrategy.failoverLimit);

                                    if (failoverCount > config.database[dbName].retryStrategy.failoverLimit) {
                                        callback(err, null);
                                    } else {
                                        isFailovering = false;

                                        const newRetryCount = 0;
                                        this.executeRaw(executeParams, newRetryCount, callback);
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

            if (sql && sql.length < 1000) {
                //logger.debug('current SQL -> ' + sql);
            } else {
                //logger.debug('current SQL -> over 1000 characters');
            }

            // apply sqlReplaces
            if (executeParams.sqlReplaces) {
                for (let i = 0; i < executeParams.sqlReplaces.length; i++) {
                    sql = util.replace(sql, '#', executeParams.sqlReplaces[i], 0);
                }
            }

            // apply conditional where
            if (executeParams.whereParams) {
                if (sqlName) {
                    const whereKeys = Object.keys(executeParams.whereParams);
                    for (let i = 0; i < whereKeys.length; i++) {
                        if (executeParams.whereParams[whereKeys[i]]) {
                            for (let j = 0; j < sqlObj[sqlName].where.length; j++) {
                                if (sqlObj[sqlName].where[j][whereKeys[i]]) {
                                    let elem;
                                    if (typeof(executeParams.whereParams[whereKeys[i]]) == 'string') {
                                        elem = "'" + executeParams.whereParams[whereKeys[i]] + "'";
                                    } else {
                                        elem = executeParams.whereParams[whereKeys[i]];
                                    }

                                    const curWhere = util.replace(sqlObj[sqlName].where[j][whereKeys[i]], '#', elem, 0);
                                    
                                    if (!sql.includes('where')) {
                                        sql += ' where ' + curWhere
                                    } else {
                                        sql += ' and ' + curWhere;
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }

            // : style parameter
            if (paramType) {
                //logger.debug('Parameter is of colon style.');

                // change sql to upper case
                sql = changeColonToUpperCase(sql);

                // replace parameters with :name
                const paramKeys = Object.keys(executeParams.params);
                for (let i = 0; i < paramKeys.length; i++) {
                    try {
                        let curKey = paramKeys[i];
                        let curValue = executeParams.params[curKey];
                        if (typeof(executeParams.paramType[curKey]) == 'undefined') {
                            curValue = "'" + curValue + "'";
                        } else if (executeParams.paramType[curKey] == 'string') {
                            curValue = "'" + curValue + "'";
                        }

                        if (curValue.length > 500) {
                            //logger.debug('mapping #' + i + ' [' + curKey + '] -> ' + 'Length is too big to print : ' + curValue.length);
                        } else {
                            //logger.debug('mapping #' + i + ' [' + curKey + '] -> [' + curValue + ']');
                        }

                        //let replaced = sql.replaceAll(':' + curKey.toUpperCase(), curValue);
                        let replaced = sql.replace(':' + curKey.toUpperCase(), curValue);
                        if (replaced) {
                            sql = replaced;
                        }

                        //replaced = sql.replaceAll(':' + curKey.toLowerCase(), curValue);
                        //if (replaced) {
                        //    sql = replaced;
                        //}
                    } catch(err2) {
                        logger.debug('mapping error : ' + JSON.stringify(err2));
                    }
                };

                sqlParams = [];
            } else {
                //logger.debug('Parameter is of normal style.');
            }

            const query = conn.query(sql, sqlParams, (err, rows) => {
                if (conn) {
                    conn.release();
                }

                if (sql && sql.length < 1000) {
                    logger.debug('SQL -> ' + query.sql);
                } else {
                    logger.debug('SQL -> over 1000 characters');
                }

                if (err) {
                    logger.debug('Error in executing SQL -> ' + err);
                    callback(err, null);
                    return;
                }
        
                const results = this.applyMapper(mapper, rows);

                callback(null, results);
            });

        });
    }

    applyMapper(mapper, rows) {
        //logger.debug('applyMapper called.');

        let results = [];
         
        if (mapper) {
            logger.debug('mapper found with attributes ' + Object.keys(mapper).length);
            rows.forEach((item, index) => {
                logger.debug('INPUT ITEM -> ' + JSON.stringify(item));

                let outputItem = {};
                Object.keys(mapper).forEach((key, position) => {
                    try {
                        if (index == 0) {
                            //logger.debug('mapping #' + position + ' [' + key + '] -> [' + mapper[key] + ']');
                        }
                        
                        outputItem[key] = item[mapper[key]];
                        if (!outputItem[key]) {
                            outputItem[key] = item[mapper[key].toUpperCase()] || item[mapper[key].toLowerCase()];
                        }
                    } catch(err2) {
                        logger.debug('mapping error : ' + JSON.stringify(err2));
                    }
                });
                //logger.debug('OUTPUT ITEM -> ' + JSON.stringify(outputItem));

                results.push(outputItem);
            });
        } else {
            //logger.debug('mapper not found. query result will be set to output.');
            results = rows;
        }

        return results;
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
                logger.debug('Error in fetching database connection -> ' + err);
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
                    logger.debug('Error in fetching fields -> ' + err);
                    callback(err, null);
                    return;
                }

                callback(null, fields);
            });
 
        });
    }


}

module.exports = DatabaseMySQL;
