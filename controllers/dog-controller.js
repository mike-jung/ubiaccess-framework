'use strict'

import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

/**
 * @Controller(path="/dog")
 */
class Dog {

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
