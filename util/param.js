'use strict';

// logger
const logger = require('./logger');

const param = {};

param.parse = function (req) {
    const requestMethod = req.method;
    const requestPath = req.baseUrl + req.path;
    logger.debug(`${requestMethod} ${requestPath} requested`);

    let params;
    if (requestMethod == 'GET') {
        params = req.query;
    } else if (requestMethod == 'POST' || requestMethod == 'PUT' || requestMethod == 'DELETE') {
        params = req.body;
    } else {
        logger.debug(`Unknown request method -> ${requestMethod}`);
    }

    if (req.params) {
        params = Object.assign(req.params, params);
    }
    
    const paramsText = JSON.stringify(params);
    if (paramsText && paramsText.length < 1000) {
        logger.debug(`PARAMS -> ${paramsText}`);
    } else {
        logger.debug(`PARAMS -> over 1000 characters.`);
    }
    

    return params;
}

module.exports = param;