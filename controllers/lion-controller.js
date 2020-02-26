/**
 * This controller registers methods inside Lion class.
 * Each method access database table.
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/lion/list
 * (3) http://localhost:7001/lion/create
 * (4) http://localhost:7001/lion/read/1
 * (5) http://localhost:7001/lion/update/1
 * (6) http://localhost:7001/lion/delete/1
 * 
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');
const Database = require('../database/database_mysql');
const sqlConfig = require('../database/sql/lion_sql');

/**
 * @Controller(path="/lion")
 */
class Lion {

    constructor() {
      this.database = new Database('database_mysql');
    }

    /**
     * @RequestMapping(path="/", method="get")
     */
    async list(req, res) {
      logger.debug('Lion:list called for path /');

      const params = param.parse(req);
      
      try {

        // get list count
        let sql = sqlConfig.lion_list.count;
        if (params.search) {
          sql = sql + ' ' + util.replace(sqlConfig.lion_list.where, "#", params.search + " like '%" + params.searchValue + "%'", 0);
        }
  
        const queryParams = {
          sql: sql,
          sqlParams: []
        }

        const rows = await this.database.query(queryParams);
        const total = rows[0].total;

        // get list
        let sql2 = sqlConfig.lion_list.sql;

        // (1) where 여부
        if (params.search) {
          sql2 = sql2 + ' ' + util.replace(sqlConfig.lion_list.where, "#", params.search + " like '%" + params.searchValue + "%'", 0);
        }
        
        // (2) order 여부
        if (params.order) {
          sql2 = sql2 + ' ' + util.replace(sqlConfig.lion_list.order, '#', params.order + ' ' + params.orderDirection, 0);
        }
        
        // (3) page 여부
        if (params.page) {
          const curPage = Number(params.page);
          const curPerPage = Number(params.perPage);
          sql2 = sql2 + ' ' + util.replace(sqlConfig.lion_list.page, '#', (curPage-1) * curPerPage + ', ' + curPerPage, 0);
        }
                
        const queryParams2 = {
          sql: sql2,
          sqlParams: []
        }

        const rows2 = await this.database.query(queryParams2);

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

    /**
     * @RequestMapping(path="/create", method="post")
     */
    async create(req, res) {
      logger.debug('Lion:create called for path /create');

      const params = param.parse(req);
        
      try {
               
        const queryParams = {
          sqlName: 'lion_create',
          params: params
        }

			  const rows = await this.database.execute(queryParams);

			  util.sendRes(res, 200, 'OK', rows);
		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

    /**
     * @RequestMapping(path="/read/:id", method="get")
     */
    async read(req, res) {
      logger.debug('Lion:read called for path /read/:id');

      const params = param.parse(req);
        
      try {
              
        const queryParams = {
          sqlName: 'lion_read',
          params: params
        }
 
			  const rows = await this.database.execute(queryParams);

			  util.sendRes(res, 200, 'OK', rows);
		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

    /**
     * @RequestMapping(path="/update/:id", method="post")
     */
    async update(req, res) {
      logger.debug('Lion:update called for path /update/:id');

      const params = param.parse(req);
        
      try {
            
        const queryParams = {
          sqlName: 'lion_update',
          params: params
        }
  
			  const rows = await this.database.execute(queryParams);

			  util.sendRes(res, 200, 'OK', rows);
		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

    /**
     * @RequestMapping(path="/delete/:id", method="delete")
     */
    async delete(req, res) {
      logger.debug('Lion:delete called for path /delete/:id');

      const params = param.parse(req);
        
      try {
           
        const queryParams = {
          sqlName: 'lion_delete',
          params: params
        }

			  const rows = await this.database.execute(queryParams);

			  util.sendRes(res, 200, 'OK', rows);
		  } catch(err) {
			  util.sendError(res, 400, 'Error in execute -> ' + err);
		  }
    }

}


module.exports = Lion;
