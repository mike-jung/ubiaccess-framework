/**
 * This controller shows simple method annotation
 * 
 * GET http://localhost:7001/tiger/hello
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');


class Tiger {

    /**
     * @RequestMapping(path="/tiger/hello")
     */
    hello(req, res) {
        logger.debug('Tiger:hello called for path /tiger/hello');

        const params = param.parse(req);
        
        const output = {
            message: 'hello'
        }
        
        util.sendRes(res, 200, 'OK', output);
    }

}


module.exports = Tiger;
