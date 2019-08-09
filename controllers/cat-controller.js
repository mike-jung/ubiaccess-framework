'use strict'

import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

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
