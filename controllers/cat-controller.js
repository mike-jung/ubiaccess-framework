/**
 * This controller registers REST API functions for methods inside Cat class.
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/cat/list
 * (2) http://localhost:7001/cat/create
 * (3) http://localhost:7001/cat/read/1
 * (4) http://localhost:7001/cat/update/1
 * (5) http://localhost:7001/cat/delete/1
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
        logger.debug('Cat:list called for path /cat');

        const params = param.parse(req);

        const cats = [
            {
                name:'sandy'
            },
            {
                name:'puma'
            }
        ]
        
        util.sendRes(res, 200, 'OK', cats);
    }
  
    create(req, res) {
        logger.debug('Cat:create called for path /cat');

        const params = param.parse(req);

    }
  
    read(req, res) {
        logger.debug('Cat:read called for path /cat/:id');
        
        const params = param.parse(req);

    }
 
    update(req, res) {
        logger.debug('Cat:update called for path /cat/:id');
        
        const params = param.parse(req);

    }
 
    delete(req, res) {
        logger.debug('Cat:delete called for path /cat/:id');
        
        const params = param.parse(req);

    }

}


module.exports = Cat;
