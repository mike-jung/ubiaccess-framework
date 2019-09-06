/**
 * This controller just loads a view file as a index page and send it to the client 
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/sheep.do
 * 
 */

'use strict'
 
import util from '../util/util';
import logger from '../util/logger';

class Index {

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
        logger.debug('sheepIndex called for path /sheep2.do');
 
        util.render(req, res, 'sheep_index2', {});
    }
 
}

module.exports = Index;
