/**
 * This controller registers methods inside Dog class.
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/cat/index
 * (2) http://localhost:7001/cat/list
 * (3) http://localhost:7001/cat/create
 * (4) http://localhost:7001/cat/read
 * (5) http://localhost:7001/cat/update
 * (6) http://localhost:7001/cat/delete
 * 
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

/**
 * @Controller(path="/dog")
 */
class Dog {

    /**
     * @RequestMapping(path="/index")
     */
    index(req, res) {
        logger.debug('Dog:index called for path /dog/index');

        const params = param.parse(req);
        
        util.render(req, res, 'dog_index', {});
    }
 
    /**
     * @RequestMapping(path="/list")
     */
    list(req, res) {
        logger.debug('Dog:list called for path /dog/list');

        const params = param.parse(req);
        
        const dogs = [
            {
                name:'sam'
            },
            {
                name:'poyo'
            }
        ]
        
        util.sendRes(res, 200, 'OK', dogs);
    }
 
    /**
     * @RequestMapping(path="/create")
     */
    create(req, res) {
        logger.debug('Dog:create called for path /dog/create');

        const params = param.parse(req);

    }
 
    /**
     * @RequestMapping(path="/read", method="get,post")
     */
    read(req, res) {
        logger.debug('Dog:read called for path /dog/read');
        
        const params = param.parse(req);

    }

    /**
     * @RequestMapping(path="/update")
     */
    update(req, res) {
        logger.debug('Dog:update called for path /dog/update');
        
        const params = param.parse(req);

    }

    /**
     * @RequestMapping(path="/delete", method="post")
     */
    delete(req, res) {
        logger.debug('Dog:delete called for path /dog/delete');
        
        const params = param.parse(req);

    }

}


module.exports = Dog;
