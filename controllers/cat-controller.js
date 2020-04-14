/**
 * This controller registers REST API functions using methods inside Cat class.
 *
 * The param module parses request parameters meeting GET, POST or other request methods.
 * The logger module saves log files in log folder.
 * The util module has several methods to simplify response handling.
 * 
 * Example request urls are as follows:
 * 
 * (1) http://localhost:8001/cat/list
 * (2) http://localhost:8001/cat/create
 * (3) http://localhost:8001/cat/read/1
 * (4) http://localhost:8001/cat/update/1
 * (5) http://localhost:8001/cat/delete/1
 * 
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

/**
 * @Controller(path="/cat", type="rest")
 */
class Cat {
 
    list(req, res) {
        logger.debug('Cat:list called for GET /cat');

        const params = param.parse(req);

        const data = [
            {
                name:'sandy'
            },
            {
                name:'sarah'
            }
        ];
        
        util.sendRes(res, 200, 'OK', data);
    }
  
    create(req, res) {
        logger.debug('Cat:create called for POST /cat');

        const params = param.parse(req);

        // Do something for create job


        const data = {}
        
        util.sendRes(res, 200, 'OK', data);
    }
  
    read(req, res) {
        logger.debug('Cat:read called for GET /cat/:id');
        
        const params = param.parse(req);

        const data = [
            {
                name:'sandy'
            }
        ];
        
        util.sendRes(res, 200, 'OK', data);
    }
 
    update(req, res) {
        logger.debug('Cat:update called for PUT /cat/:id');
        
        const params = param.parse(req);

        // Do something for update job


        
        const data = {}
        
        util.sendRes(res, 200, 'OK', data);
    }
 
    delete(req, res) {
        logger.debug('Cat:delete called for DELETE /cat/:id');
        
        const params = param.parse(req);

        // Do something for delete job


        
        const data = {}
        
        util.sendRes(res, 200, 'OK', data);
    }

}


module.exports = Cat;
