/**
 * This controller tests cookies
 * 
 */

'use strict';

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

class CookieController {

    constructor() {
        //logger.debug(`CookieController initialized.`);
    }

    /**
     * This function set a cookie
     * @route GET /test/set_cookie
     * @group test - Operations about test
     * @returns {object} redirect to show_cookie
     * @returns {Error}  default - Unexpected error
     */
	set_cookie(req, res) {
		const params = param.parse(req);

		res.cookie('user', {
			id: 'test01',
			name: '소녀시대',
			authorized: true
		});

		res.redirect('/test/show_cookie');
	}
 
	 /**
     * This function show cookies
     * 
     * @route GET /test/show_cookie
     * @group test - Operations about test
     * @returns {object} cookie object
     * @returns {Error}  default - Unexpected error
     */
	show_cookie(req, res) {
        const params = param.parse(req);

		const output = {
			code: 200,
			message: 'OK',
			results: req.cookies
		}

        util.sendRes(res, 200, 'OK', output);
	}
  
}

module.exports = CookieController;