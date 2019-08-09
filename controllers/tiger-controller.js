'use strict'

import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';


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
