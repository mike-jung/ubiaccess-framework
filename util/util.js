'use strict';

const util = {};

// logger
const logger = require('./logger');


/**
 * Send response
 * 
 * @param {object} res res object in express
 * @param {number} code result code
 * @param {string} message result message
 * @param {object} output output object such as database query rows
 */
util.sendRes = function (res, code, message, output) {
    const result = {
        code: code,
        message: message,
        data: output
    }

    util.sendResponse(res, result);
}


/**
 * Send response
 * 
 * @param {object} res res object in express
 * @param {object} output output object such as database query rows
 */
util.sendResponse = function (res, output) {
    if (typeof(output) == 'object') {
        output = JSON.stringify(output);
        //logger.debug('output object converted to json.');
    }
    
    res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
    res.end(output);
}

/**
 * Send error
 * 
 * @param {object} res res object in express
 * @param {number} code result code
 * @param {string} message result message
 */
util.sendError = function (res, code, message) {
    const output = {
        code: code,
        message: message
    }

    res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
    res.end(JSON.stringify(output));
}

/**
 * Send error
 * 
 * @param {object} res res object in express
 * @param {number} code result code
 * @param {string} message result message
 */
util.sendErr = function (res, requestCode, code, message, type, details) {
    const output = {
        requestCode: requestCode,
        code: code,
        message: message,
        type: type,
        details: details
    }

    res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
    res.end(JSON.stringify(output));
}


/**
 * Render view file and send response
 */
util.render = (req, res, targetView, targetContext) => {
    req.app.render(targetView, targetContext, function(err, html) {
        if (err) {
            logger.error('View rendering error : ' + err);
            util.sendError(res, 601, 'View rendering error : ' + err)
            return;
        }

        res.end(html);
    });
}


/**
 * replace # character in the sql statement
 */
util.replace = (strData, strTextToReplace, strReplaceWith, replaceAt) => {
    //logger.debug('replace called -> ' + typeof(strData) + ', ' + JSON.stringify(strData));

    var index = strData.indexOf(strTextToReplace);
    for (var i = 1; i < replaceAt; i++) {
        index = strData.indexOf(strTextToReplace, index + 1);
    }

    if (index >= 0) {
        return strData.substr(0, index) + strReplaceWith + strData.substr(index + strTextToReplace.length, strData.length);
    }

    return strData;
}


module.exports = util;
