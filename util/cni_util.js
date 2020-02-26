'use strict';

/**
 * CNI utility (Utility for Samsung Channel Integrator)
 * 
 * @author Mike
 */ 
  
const logger = require('./logger');
 

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
            logger.debug(`values.external -> ${values.external}`);

            let externalName = 'cni';
            if (values.external) {
                externalName = values.external;
            }
            logger.debug(`external name -> ${externalName}`);

            if (external[externalName]) {
                external[externalName].send(
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
                            logger.debug('outname is set : ' + values.outname);

                            if (result[values.outname]) {
                                rows = result[values.outname];
                            } else {
                                logger.debug('attribute [' + values.outname + '] not found.');
                                logger.debug('result type -> ' + typeof(result));
                                logger.debug(result);
                            }
                        } else {
                            logger.debug('outname is not set.');
                            
                            // ehrComHeader 속성이 있는지 확인 (복합구조 여부 확인)
                            let remainingKey = '';
                            let remainingObj = null;
                            let headerFound = false;

                            if (typeof(result) != 'undefined' && result != null) {
                                const result1Keys = Object.keys(result);
                                if (result[result1Keys[0]]) {
                                    // 하위 객체 참조
                                    const result2 = result[result1Keys[0]];
                                    const result2Keys = Object.keys(result2);
                                    
                                    // 하위 객체의 모든 키 검사
                                    for (let k = 0; k < result2Keys.length; k++) {
                                        if (result2Keys[k] == 'ehrComHeader') {
                                            logger.debug('ehrComHeader found. compound structure will be processed.');
                                            headerFound = true;
                                        } else {
                                            remainingKey = result2Keys[k];
                                            remainingObj = result2[remainingKey];
                                        }
                                    }
                                }
                            }

                            logger.debug(`headerFound -> ${headerFound}`);
                            logger.debug(`remainingKey -> ${remainingKey}`);

                            // 복합구조로 확인된 경우 하위 대상 객체를 result 변수에 할당
                            if (headerFound) {
                                result = remainingObj;
                            }


                            // 속성이 1개인 경우
                            if (typeof(result) == 'undefined' || result == null) {
                                rows = result;
                            } else {
                                const resultKeys = Object.keys(result);
                                logger.debug('attribute count of result object : ' + resultKeys.length);

                                if (resultKeys.length < 2) {
                                    if (result[resultKeys[0]]) {
                                        if (typeof(result[resultKeys[0]]) == 'string') {
                                            rows = result;
                                        } else {
                                            // 서브 속성이 1개인 경우
                                            const resultSubKeys = Object.keys(result[resultKeys[0]]);
                                            logger.debug('attribute count of result sub object : ' + resultSubKeys.length);

                                            if (resultSubKeys.length < 2) {
                                                const subResult = result[resultKeys[0]];
                                                if (subResult) {
                                                    rows = subResult[resultSubKeys[0]];
                                                } else {
                                                    rows = result[resultKeys[0]];
                                                }
                                            } else {
                                                rows = result[resultKeys[0]];
                                            }
                                        }
                                    } else {
                                        rows = result;
                                    }
                                } else { // 속성이 여러 개인 경우 result 자체를 rows에 할당
                                    rows = result;
                                }
                            }
                        
                        }
                        
                        if (values.mapper) {
                            logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                            //logger.debug('rows -> ' + JSON.stringify(rows));
                            
                            // 배열인 경우 속성 1개의 값으로서 배열의 원소들을 매핑 처리
                            if (Array.isArray(rows)) {
                                logger.debug('rows type is array.');

                                results = this.applyMapper(values, rows);
                            } else {    // 객체 타입인 경우
                                // 속성이 1개인 경우 그 속성의 값을 매핑 처리
                                if (typeof(rows) == 'undefined' || rows == null) {
                                    results = this.applyMapper(values, rows);
                                } else {
                                    const rowsKeys = Object.keys(rows);
                                    logger.debug('attribute count of rows object : ' + rowsKeys.length);
                                    logger.debug(rowsKeys);

                                    if (rowsKeys.length < 2) {
                                        results = this.applyMapper(values, rows);
                                    } else { // 속성이 여러 개인 경우 모든 속성의 값을 매핑 처리
                                        results = {};

                                        for (let i = 0; i < rowsKeys.length; i++) {
                                            let curKey = rowsKeys[i];
                                            let newKey = this.applyMapperToName(values, curKey);
                                            if (newKey) {
                                                logger.debug('new key name mapped : ' + curKey + ' -> ' + newKey);
                                            } else  {
                                                newKey = curKey;
                                            }
                                            logger.debug('key name mapped : ' + curKey + ' -> ' + newKey);

                                            results[newKey] = this.applyMapper(values, rows[curKey]);
                                        }
                                    }
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

    applyMapper(values, rows) {
        logger.debug('applyMapper called.');

        let output;
         
        if (Array.isArray(rows)) {  // 레코드 배열인 경우
            logger.debug('rows is an array.');
            output = [];

            for (let index = 0; index < rows.length; index++) {
                let item = rows[index];
                let outputItem = {};

                const mapperKeys = Object.keys(values.mapper);
                for (let position = 0; position < mapperKeys.length; position++) {
                    let key = mapperKeys[position];

                    try {
                        if (index == 0) {
                            logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');
                        }

                        outputItem[key] = item[values.mapper[key]];
                        if (!outputItem[key]) {
                            outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                        }
                        
                        if (!outputItem[key]) {
                            if (typeof(item[values.mapper[key]]) == 'string') {
                                outputItem[key] = '';
                            } else if (typeof(item[values.mapper[key]]) == 'number') {
                                outputItem[key] = 0;
                            }
                        }

                        logger.debug('mapped value : ' + key + ' -> ' + outputItem[key]);

                    } catch(err) {
                        logger.debug('mapping error : ' + JSON.stringify(err));
                    }
                }

                output.push(outputItem);
            }
                
        } else if(typeof(rows) == 'object') {          // 객체 하나인 경우
            logger.debug('rows is an object.');
            output = {};

            let item = rows;
            let outputItem = {};

            const mapperKeys = Object.keys(values.mapper);
            for (let position = 0; position < mapperKeys.length; position++) {
                let key = mapperKeys[position];

                try {
                    logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + ']');

                    outputItem[key] = item[values.mapper[key]];
                    if (!outputItem[key]) {
                        outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                    }
                } catch(err) {
                    logger.debug('mapping error : ' + err);
                }
            }

            output = outputItem;
            
        } else {
            logger.debug('current type not applied to mapper -> ' + typeof(rows));

            output = rows;
        }

        return output;
    }


    applyMapperToName(values, inputName) {
        logger.debug('applyMapperToName called : ' + inputName);

        let outputName = null;

        const mapperKeys = Object.keys(values.mapper);
        for (let position = 0; position < mapperKeys.length; position++) {
            let key = mapperKeys[position];
            logger.debug('current key -> ' + key);

            try {
                if (inputName == values.mapper[key]) {
                    outputName = key;
                }

                if (!outputName) {
                    if (inputName == values.mapper[key].toUpperCase()) {
                        outputName = key;
                    } else if (inputName == values.mapper[key].toLowerCase()) {
                        outputName = key;
                    }
                }
            } catch(err) {
                logger.debug('mapping error : ' + err);
            }
        }

        return outputName;
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

