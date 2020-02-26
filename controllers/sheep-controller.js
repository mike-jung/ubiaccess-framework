/**
 * This controller uses table-controller module which is pre-defined one for REST database access.
 * 
 * GET http://localhost:7001/sheep/list
 * POST http://localhost:7001/sheep/create
 * GET http://localhost:7001/sheep/read/1
 * PUT http://localhost:7001/sheep/update/1
 * DELETE http://localhost:7001/sheep/delete/1
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

const Database = require('../database/database_mysql');
const TableController = require('../loader/table-controller');

/**
 * @Controller(path="/sheep")
 */
class Sheep extends TableController {

    constructor() {
        const tableName = 'test.person';
        const requestPath = '/sheep';

        super(tableName, requestPath);
    }
  
    /**
     * @RequestMapping(path="/", method="get")
     */
    async list(req, res) {
        logger.debug('Sheep:list called for path /sheep/');

        const params = param.parse(req);
        
        try {
            // call TableController's list method
            const output = await super.listAsync(req, res);
            
            util.sendRes(res, 200, 'OK', output);
        } catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
        }
        
    }
  
    /**
     * @RequestMapping(path="/", method="post")
     */
    async create(req, res) {
        logger.debug('Sheep:create called for path /sheep/');

        const params = param.parse(req);

        try {
            // call TableController's create method
            const output = await super.createAsync(req, res);
            
            util.sendRes(res, 200, 'OK', output);
        } catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
        }
        
    }

    /**
     * @RequestMapping(path="/:id", method="get")
     */
    async read(req, res) {
        logger.debug('Sheep:read called for path /sheep/:id');

        const params = param.parse(req);

        try {
            // call TableController's read method
            const output = await super.readAsync(req, res);
            
            util.sendRes(res, 200, 'OK', output);
        } catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
        }
        
    }

    /**
     * @RequestMapping(path="/:id", method="put")
     */
    async update(req, res) {
        logger.debug('Sheep:update called for path /sheep/:id');

        const params = param.parse(req);

        try {
            // call TableController's update method
            const output = await super.updateAsync(req, res);
            
            util.sendRes(res, 200, 'OK', output);
        } catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
        }
        
    }

    /**
     * @RequestMapping(path="/:id", method="delete")
     */
    async delete(req, res) {
        logger.debug('Sheep:delete called for path /sheep/:id');

        const params = param.parse(req);

        try {
            // call TableController's delete method
            const output = await super.deleteAsync(req, res);
            
            util.sendRes(res, 200, 'OK', output);
        } catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
        }
        
    }

}


module.exports = Sheep;
