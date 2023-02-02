/**
 * This controller just loads a view file as a index page and send it to the client 
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/sheep.do
 * 
 */

'use strict'
 
const util = require('../util/util');
const logger = require('../util/logger');
const param = require('../util/param');
const Database = require('../database/database_mysql');

class Index {

    constructor() {
        this.database = new Database('database_mysql');
    }
  
    /**
     * @RequestMapping(path="/sheep.do", method="get")
     */
    sheepIndex(req, res) {
        logger.debug('sheepIndex called for path /sheep.do');
 
        util.render(req, res, 'sheep_index', {});
    }

    /**
     * @RequestMapping(path="/sheep2.do", method="get")
     */
    sheepIndex2(req, res) {
        logger.debug('sheepIndex2 called for path /sheep2.do');
 
        util.render(req, res, 'sheep_index2', {});
    }
 
    /**
     * @RequestMapping(path="/sheep3.do", method="get")
     */
    sheepIndex3(req, res) {
        logger.debug('sheepIndex3 called for path /sheep3.do');
 
        util.render(req, res, 'sheep_index3', {});
    }
 
    /**
     * @RequestMapping(path="/sheep4.do", method="get")
     */
    sheepIndex4(req, res) {
        logger.debug('sheepIndex4 called for path /sheep4.do');
 
        util.render(req, res, 'sheep_index4', {});
    }
   
}

module.exports = Index;
