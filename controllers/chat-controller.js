/**
 * A controller for sending a message using chat channel
 * 
 * GET http://localhost:7001/chat/send
 * 
 * requestCode 20191012142021100013
 * userId test01
 * sender 01010001000
 * receiver 01020002000
 * command chat
 * type text
 * data Hello
 * 
 */

'use strict'

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');
const ioUtil = require('../util/socketio_util');

/**
 * @Controller(path="/chat")
 */
class Chat {
 
    /**
     * @RequestMapping(path="/send", method="get")
     */
    async send(req, res) {
        logger.debug('Chat:send called for path /chat/send');

        const params = param.parse(req);
        
		try {
            ioUtil.send(req.app.io, params);

			util.sendRes(res, 200, 'OK', 'message event requested.');
		} catch(err) {
			util.sendError(res, 400, 'Error in message request -> ' + err);
		}

    }
   
}


module.exports = Chat;
