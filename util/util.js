'use strict';

const util = {};


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
        output: output
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
        //console.log('output object converted to json.');
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


module.exports = util;
