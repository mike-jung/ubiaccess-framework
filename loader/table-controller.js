'use strict'

import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';
import Database from '../database/database_mysql';
import sqlConfig from '../config/sql_config';

class TableController {

    // Initialize with table name
    constructor(tableName, requestPath) {
      this.tableName = tableName;
      this.requestPath = requestPath;

      this.database = new Database('database_mysql');
    }
 
    // List controller function
    async list(req, res) {
      logger.debug('Table:list called for GET ' + this.requestPath);

      const params = param.parse(req);
      
      try {

        // get list count
        let sql = sqlConfig.table_list.count;

        // (1) from 에서 테이블 이름 대체
        sql = util.replace(sql, "#", this.tableName, 0);

        // (2) where 에서 검색어 대체
        if (params.search) {
          sql = sql + ' ' + util.replace(sqlConfig.table_list.where, "#", params.search + " like '%" + params.searchValue + "%'", 0);
        }
  
        const rows = await this.database.query(sql, []);
        const total = rows[0].total;

        // get list
        let sql2 = sqlConfig.table_list.sql;

        // (1) select 에서 칼럼 이름 대체
        if (params.columns) {
          sql2 = util.replace(sql2, "#", params.columns, 0);
        } else {  // 클라이언트에서 보낸 columns 파라미터가 없는 경우, 테이블의 전체 칼럼 조회
          const columnInfo = await this.database.fields(this.tableName);
          const columns = Object.keys(columnInfo);
          console.log('columns -> ' + columns);

          sql2 = util.replace(sql2, "#", columns.join(), 0);
        }

        // (2) select 에서 테이블 이름 대체
        sql2 = util.replace(sql2, "#", this.tableName, 0);

        // (3) where 여부
        if (params.search) {
          sql2 = sql2 + ' ' + util.replace(sqlConfig.table_list.where, "#", params.search + " like '%" + params.searchValue + "%'", 0);
        }
        
        // (2) order 여부
        if (params.order) {
          sql2 = sql2 + ' ' + util.replace(sqlConfig.table_list.order, '#', params.order + ' ' + params.orderDirection, 0);
        }
        
        // (3) page 여부
        if (params.page) {
          const curPage = Number(params.page);
          const curPerPage = Number(params.perPage);
          sql2 = sql2 + ' ' + util.replace(sqlConfig.table_list.page, '#', (curPage-1) * curPerPage + ', ' + curPerPage, 0);
        }
        
        const rows2 = await this.database.query(sql2, []);

        const output = {
          header: {
            page: params.page,
            perPage: params.perPage,
            total: total,
            search: params.search,
            searchValue: params.searchValue,
            order: params.order,
            orderDirection: params.orderDirection
          },
          body: rows2
        }
        
        util.sendRes(res, 200, 'OK', output);

      } catch(err) {
        util.sendError(res, 400, 'Error in execute -> ' + err);
      }
    }
 
    // Create controller function
    async create(req, res) {
      logger.debug('Table:create called for PUT ' + this.requestPath);

      const params = param.parse(req);
        
      try {
        let sql = sqlConfig.table_create.sql;
        
        // (1) insert 에서 테이블 이름 대체
        sql = util.replace(sql, "#", this.tableName, 0);

        // (2) insert 에서 칼럼 이름과 칼럼 값 대체
        const columnInfo = await this.database.fields(this.tableName);
        const columns = Object.keys(columnInfo);
        console.log('columns -> ' + columns);

        let columnNames = '';
        let columnValues = '';
        for (let i = 0; i < columns.length; i++) {
          if (params[columns[i]]) { // 요청 파라미터에 칼럼 이름이 있는 경우
            console.log('column found -> ' + columns[i]);
            if (columnNames.length > 0) {
              columnNames += ','
            }
            columnNames += columns[i];

            const columnType = columnInfo[columns[i]].Type;
            console.log('column type -> ' + columnType);

            if (columnValues.length > 0) {
              columnValues += ','
            }
            if (columnType.includes('varchar') || columnType.includes('text')) {
              columnValues += "'" + params[columns[i]] + "'";
            } else {
              columnValues += params[columns[i]];
            }
          }
        }
        console.log('columnNames -> ' + columnNames);
        console.log('columnValues -> ' + columnValues);

        sql = util.replace(sql, "#", columnNames, 0);
        sql = util.replace(sql, "#", columnValues, 0);


			  const rows = await this.database.query(sql, []);
 
        const output = {
          header: {},
          body: rows
        }
        
			  util.sendRes(res, 200, 'OK', output);
		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }
 
    async read(req, res) {
      logger.debug('Table:read called for GET ' + this.requestPath + '/:id');

      const params = param.parse(req);
        
      try {
			  
        // get sql
        let sql = sqlConfig.table_read.sql;

        // (1) select 에서 칼럼 이름 대체
        if (params.columns) {
          sql = util.replace(sql, "#", params.columns, 0);
        } else {  // 클라이언트에서 보낸 columns 파라미터가 없는 경우, 테이블의 전체 칼럼 조회
          const columnInfo = await this.database.fields(this.tableName);
          const columns = Object.keys(columnInfo);
          console.log('columns -> ' + columns);

          sql = util.replace(sql, "#", columns.join(), 0);
        }

        // (2) select 에서 테이블 이름 대체
        sql = util.replace(sql, "#", this.tableName, 0);

        // (3) where 문 대체
        if (params.id) {
          sql = sql + ' ' + util.replace(sqlConfig.table_read.where, "#", "id = " + params.id, 0);
        }
        
        const rows = await this.database.query(sql, []);

        const output = {
          header: {
            search: params.search,
            searchValue: params.searchValue
          },
          body: rows
        }
        
        util.sendRes(res, 200, 'OK', output);

		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }
 
    // Update controller function
    async update(req, res) {
      logger.debug('Table:update called for PUT ' + this.requestPath + '/:id');

      const params = param.parse(req);
        
      try {
			  
        // get sql
        let sql = sqlConfig.table_update.sql;

        // (1) update 에서 테이블 이름 대체
        sql = util.replace(sql, "#", this.tableName, 0);
 
        // (2) update 에서 칼럼 이름과 칼럼 값 대체
        const columnInfo = await this.database.fields(this.tableName);
        const columns = Object.keys(columnInfo);
        console.log('columns -> ' + columns);

        let columnMapping = '';
        for (let i = 0; i < columns.length; i++) {
          if (params[columns[i]]) { // 요청 파라미터에 칼럼 이름이 있는 경우
            console.log('column found -> ' + columns[i]);
            if (columnMapping.length > 0) {
              columnMapping += ','
            }
            
            const columnType = columnInfo[columns[i]].Type;
            console.log('column type -> ' + columnType);
 
            if (columnType.includes('varchar') || columnType.includes('text')) {
              columnMapping += columns[i] + '=' + "'" + params[columns[i]] + "'";
            } else {
              columnMapping += columns[i] + '=' + params[columns[i]];
            }
          }
        }
        console.log('columnMapping -> ' + columnMapping);

        sql = util.replace(sql, "#", columnMapping, 0);

        // (3) where 문 대체
        if (params.id) {
          sql = sql + ' ' + util.replace(sqlConfig.table_read.where, "#", "id = " + params.id, 0);
        }
        
        const rows = await this.database.query(sql, []);

        const output = {
          header: {},
          body: rows
        }
        
        util.sendRes(res, 200, 'OK', output);

		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

    // Delete controller function
    async delete(req, res) {
      logger.debug('Table:delete called for DELETE ' + this.requestPath + '/:id');

      const params = param.parse(req);
        
      try {
			  
        // get sql
        let sql = sqlConfig.table_delete.sql;

        // (1) delete 에서 테이블 이름 대체
        sql = util.replace(sql, "#", this.tableName, 0);
 
        // (2) delete 에서 칼럼 이름과 칼럼 값 대체
        const columnInfo = await this.database.fields(this.tableName);
        const columns = Object.keys(columnInfo);
        console.log('columns -> ' + columns);

        let columnMapping = '';
        for (let i = 0; i < columns.length; i++) {
          if (params[columns[i]]) { // 요청 파라미터에 칼럼 이름이 있는 경우
            console.log('column found -> ' + columns[i]);
            if (columnMapping.length > 0) {
              columnMapping += ','
            }
            
            const columnType = columnInfo[columns[i]].Type;
            console.log('column type -> ' + columnType);
 
            if (columnType.includes('varchar') || columnType.includes('text')) {
              columnMapping += columns[i] + '=' + "'" + params[columns[i]] + "'";
            } else {
              columnMapping += columns[i] + '=' + params[columns[i]];
            }
          }
        }
        console.log('columnMapping -> ' + columnMapping);

        sql = util.replace(sql, "#", columnMapping, 0);

        // (3) where 문 대체
        if (params.id) {
          sql = sql + ' ' + util.replace(sqlConfig.table_read.where, "#", "id = " + params.id, 0);
        }
        
        const rows = await this.database.query(sql, []);

        const output = {
          header: {},
          body: rows
        }
        
        util.sendRes(res, 200, 'OK', output);

		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

}


module.exports = TableController;
