'use strict';

/**
 * CNI utility (Utility for Samsung Channel Integrator)
 * 
 * @author Mike
 */ 
  
var logger = require('./logger');
 

class CniUtil {

    constructor() {
        logger.debug(`CniUtil initialized.`);
 
    }
 

    send(values) {
        return new Promise((resolve, reject) => {
            this.query(values, (err, table) => {
                if (err) {
                    reject(err);
                }

                resolve(table);
            });
        });
    }


    query(values, callback) {
        try {
            
            // external 객체 참조
            const external = values.req.app.get('external');
            
            
            // external의 cni 참조
            if (external.cni) {
                external.cni.send(
                    values.method,
                    values.url,
                    values.input,
                    (err, result) => {
                        if (err) {
                            logger.warn('exception in sending -> ' + err);

                            if (callback) {
                                callback('exception in sending -> ' + err, null);
                            } else {
                                this.sendError(values.res, values.params.requestCode, 'send 실패', err);
                            }
                        }
                            
                        let output = {};
                        let results = [];
                        
                        let rows;
                        
                        if (values.outname && result) {
                            if (result[values.outname]) {
                                rows = result[values.outname];
                            } else {
                                logger.debug('attribute [' + values.outname + '] not found.');
                                logger.debug('result type -> ' + typeof(result));
                                logger.debug(result);
                            }
                        } else {
                            rows = result;
                        }
                        
                        if (values.mapper) {
                            logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                            logger.debug('rows -> ' + JSON.stringify(rows));
                            
                            if (Array.isArray(rows)) {  // 레코드 배열인 경우
                                logger.debug('rows is an array.');

                                rows.forEach((item, index) => {
                                    let outputItem = {};
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
                                
                            } else {       // 객체 하나인 경우
                                logger.debug('rows is an object.');

                                if (rows) {
                                    let item = rows;
                                    let outputItem = {};
                                    Object.keys(values.mapper).forEach((key, position) => {
                                        try {
                                            logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');

                                            outputItem[key] = item[values.mapper[key]];
                                            if (!outputItem[key]) {
                                                outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                                            }
                                        } catch(err2) {
                                            logger.debug('mapping error : ' + err2);
                                        }
                                    });

                                    results.push(outputItem);
                                } else {
                                    logger.debug('rows is null.');
                                }
                            }
                            
                        } else {
                            logger.debug('mapper not found. query result will be set to output.');
                            output = rows;
                        }
                        output.results = results;
                    

                        
                        
                        if (callback) {
                            callback(null, output);

                        } else {
                            this.sendSuccess(values.res, values.params.requestCode, values.outname + ' success', output);
                            
                        }
                        
                    }
                );
                
            } else {
                logger.warn('cni object not found.');
                
                if (callback) {
                    callback('cni object not found.', null);
                } else {
                    this.sendError(values.res, values.params.requestCode, 'chis_eai object not found.', {});
                }
            }
            
            
        } catch(err) {
            logger.error('exception -> ' + err);
            
            if (callback) {
                callback('exception -> ' + err, null);
            } else {
                this.sendError(values.res, values.params.requestCode, 'exception 발생', err);
            }
        }	
            
    }



    sendSuccess(res, paramRequestCode, message, result) {
        logger.debug('sendSuccess called.');
        
        this.sendResponse(res, paramRequestCode, 200, message, 'string', 'application/json', 'mci', '1.0', result);
    }

    sendError(res, paramRequestCode, message, err) {
        logger.debug('sendError called.');
        
        this.sendResponse(res, paramRequestCode, 400, message, 'error', 'application/json', 'error', '1.0', err);
    }

    sendErrorString(res, paramRequestCode, message, result) {
        logger.debug('sendErrorString called.');
        
        this.sendResponse(res, paramRequestCode, 400, message, 'string', 'plain/text', 'none', '1.0', result);
    }

    sendResponse(res, requestCode, code, message, resultType, resultFormat, resultProtocol, resultVersion, result) {
        logger.debug('sendResponse called : ' + code);
        
        if (typeof(result) == 'object') {
            logger.debug(message);
        }
        
        const response = {
            requestCode:requestCode,
            code:code,
            message:message,
            resultType:resultType,
            resultFormat:resultFormat,
            resultProtocol:resultProtocol,
            resultVersion:resultVersion,
            result:result
        }
        
        const responseStr = JSON.stringify(response);
        
        try {
            res.status(code).send(responseStr);
        } catch(err) {
            logger.error('error in sendResponse -> ' + JSON.stringify(err));
        }
    }

}


module.exports = CniUtil;

