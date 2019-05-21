'use strict';

import mysql from 'mysql';
import config from'../config/config';
import sqlConfig from'../config/sql_config';
import logger from '../util/logger';
 
const pool = mysql.createPool(config.database['database_mysql'].master);

class DatabaseMySQL {

    constructor(dbName) {
        logger.debug('DatabaseMySQL initialized -> ' + dbName);
 
        this.isMaster = true;
        this.retryCount = 0;
        this.failoverCount = 0;
    }
 
    getPool() {
        console.log('getPool called.');
    
        return pool;
    }

    execute(sqlName, params) {
        return new Promise((resolve, reject) => {
            // check SQL definition
            if (!sqlConfig[sqlName]) {
                reject(`Sql definition for ${sqlName} not found in sql_config`);
            }

            let sql = sqlConfig[sqlName].sql;

            let sqlParams = [];
            sqlConfig[sqlName].params.forEach((item, index) => {
                sqlParams.push(params[item]);
            })

            this.executeRaw(sql, sqlParams, (err, rows) => {
                if (err) {
                    reject(err);
                }

                resolve(rows);
            });
        });
    }

    executeSql(sqlName, params, callback) {
        // check SQL definition
        if (!sqlConfig[sqlName]) {
            callback(new Error(`Sql definition for ${sqlName} not found in sql_config`), null);
            return;
        }
        
        let sql = sqlConfig[sqlName].sql;

        let sqlParams = [];
        sqlConfig[sqlName].params.forEach((item, index) => {
            sqlParams.push(params[item]);
        })

        this.executeRaw(sql, sqlParams, callback);
    }

    executeRaw(sql, sqlParams, callback) {
        
        pool.getConnection((err, conn) => {
            if (err) {
                console.log('Error in fetching database connection -> ' + err);
                callback(err, null);
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

}

module.exports = DatabaseMySQL;
