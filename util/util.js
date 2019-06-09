'use strict';

const util = {};

/*
import Database from '../database/database_mysql';
util.database_mysql = new Database('database_mysql');
*/


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


/*
util.query = (values, callback) => {
    try {
        // database instance
        var database = util[values.database_name];

        if (!database) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database object -> ' + values.database_name);
            return;
        }
 
        database[values.database_file][values.database_module](database.pool, values.input, (err, rows) => {
            // Error - send error information to client
            if (err) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                return;
            }

            // send success response in case rows found
            if (rows) {
                logger.debug('RESULT -> ' + JSON.stringify(rows));

                // response data
                var output = {};
                var results = [];
                
                if (values.database_type == 'oracle') {
                    rows = rows.rows;
                }
                
                if (values.mapper) {
                    logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                    rows.forEach((item, index) => {

                        var outputItem = {};
                        Object.keys(values.mapper).forEach((key, position) => {
                            try {
                                if (index == 0) {
                                    logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                                }
                                
                                outputItem[key] = item[values.mapper[key]];
                                if (!outputItem[key]) {
                                    outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                                }
                            } catch(err2) {
                                logger.debug('mapping error : ' + JSON.stringify(err2));
                            }
                        });

                        results.push(outputItem);
                    });
                } else {
                    logger.debug('mapper not found. query result will be set to output.');
                    results = rows;
                }

                output.results = results;
                
                if (values.input.search) {
                    output.search = values.input.search;
                }
                
                if (values.input.page) {
                    output.page = values.input.page;
                }
                
                if (values.input.order) {
                    output.order = values.input.order;
                }
                
                // moment 객체 추가
                output.moment = moment;
                
                logger.debug('OUTPUT -> ' + JSON.stringify(output));

                // session user 데이터 추가
                if (values.req.session.user) {
                    output.session_user = values.req.session.user;
                }

                
                // use callback if callback object exists
                if (callback) {
                    callback(output);
                    
                // make a view using the output if view object exists
                } else if (values.view) {
                    if (values.view_nodata) {
                        if (output.results.length > 0) {

                            values.req.app.render(values.view, output, function(err, html) {
                                if (err) {
                                    //logger.debug('View rendering error : ' + JSON.stringify(err));
                                    logger.debug('View rendering error : ' + err);
                                    return;
                                }
                                
                                values.res.end(html);
                            });
                        } else {
                            values.req.app.render(values.view_nodata, values.view_nodata_context, function(err, html) {
                                if (err) {
                                    //logger.debug('View rendering error : ' + JSON.stringify(err));
                                    logger.debug('View rendering error : ' + err);
                                    return;
                                }
                                
                                values.res.end(html);
                            });
                        }
                    } else {
                        values.req.app.render(values.view, output, function(err, html) {
                            if (err) {
                                //logger.debug('View rendering error : ' + JSON.stringify(err));
                                logger.debug('View rendering error : ' + err);
                                return;
                            }
                            
                            values.res.end(html);
                        });
                    }
                    
                } else {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'list', output);
                }

            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' failure', 'string', 'no record found.');
            }
        });
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
}


util.query2 = (values, callback) => {
    try {
        // database instance
        var database = values.req.app.get(values.database_name);

        if (!database) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database object -> ' + values.database_name);
            return;
        }

        if (!database.pool) {
            thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'string', 'no database pool object -> ' + values.database_name);
            return;
        }

        if (!database[values.database_file]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database file -> ' + values.database_file);
            return;
        }

        if (!database[values.database_file][values.database_module]) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' processing error', 'error', 'no database module -> ' + values.database_module);
            return;
        }


        database[values.database_file][values.database_module](database.pool, values.database_file, values.input, values.params_type, (err, rows) => {
            // Error - send error information to client
            if (err) {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' error occurred.', 'error', err);

                return;
            }

            // send success response in case rows found
            if (rows) {
                logger.debug('RESULT -> ' + JSON.stringify(rows));

                // response data
                var output = {};
                var results = [];
                
                if (values.database_type == 'oracle') {
                    rows = rows.rows;
                }
                
                if (values.mapper) {
                    logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                    rows.forEach((item, index) => {

                        var outputItem = {};
                        Object.keys(values.mapper).forEach((key, position) => {
                            try {
                                logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                                outputItem[key] = item[values.mapper[key]];
                                if (!outputItem[key]) {
                                    outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                                }
                            } catch(err2) {
                                logger.debug('mapping error : ' + JSON.stringify(err2));
                            }
                        });

                        results.push(outputItem);
                    });
                } else {
                    logger.debug('mapper not found. query result will be set to output.');
                    results = rows;
                }

                output.results = results;
                
                if (values.input.search) {
                    output.search = values.input.search;
                }
                
                if (values.input.page) {
                    output.page = values.input.page;
                }
                
                if (values.input.order) {
                    output.order = values.input.order;
                }
                
                logger.debug('OUTPUT -> ' + JSON.stringify(output));

                // use callback if callback object exists
                if (callback) {
                    callback(output);
                    
                // make a view using the output if view object exists
                } else if (values.view) {
                    values.req.app.render(values.view, output, function(err, html) {
                        values.res.end(html);
                    });
                    
                } else {
                    thisModule.sendJson(values.res, values.params.requestCode, 200, values.database_file + ':' + values.database_module + ' success', 'list', output);
                }

            } else {
                thisModule.sendJson(values.res, values.params.requestCode, 400, values.database_file + ':' + values.database_module + ' failure', 'string', 'no record found.');
            }
        });
    } catch(err) {
        logger.debug('Error : ' + JSON.stringify(err));
    }
}

*/


util.render = (req, res, targetView, targetContext) => {
    req.app.render(targetView, targetContext, function(err, html) {
        if (err) {
            logger.error('View rendering error : ' + err);
            sendError(res, 601, 'View rendering error : ' + err)
            return;
        }

        res.end(html);
    });
}


module.exports = util;
