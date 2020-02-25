'use strict';

/**
 * MCI utility
 * 
 * @author Mike
 */ 
 
const HashMap = require('hashmap');
const logger = require('./logger');
  


class MciUtil {

    constructor() {
        logger.debug(`MciUtil initialized.`);

        // Map : ID to remaining buffer object
        this.remainingMap = new HashMap();
    }


    processData(res, conn, paramRequestCode, values, data, processCompleted, callback) {
        // check app_package and length first
        logger.debug('typeof data : ' + typeof(data));
        
        let toClass = {}.toString;
        let data_type = toClass.call(data);
        
        logger.debug('[[Class]] property : ' + data_type);
        logger.debug('is Buffer? : ' + (data instanceof Buffer));

        // concat remaining buffer if exists
        if (this.remainingMap.has(conn.id)) {
            logger.debug('remaining buffer for socket [' + conn.id + '] exists.');
            
            let remainingBuffer = this.remainingMap.get(conn.id);
            let concatData = Buffer.alloc(data.length + remainingBuffer.length);
            concatData.fill();
            remainingBuffer.copy(concatData, 0);
            data.copy(concatData, remainingBuffer.length);
            data = concatData;

            //logger.debug('DATA after concat : %s', concatData);

        } else {
            logger.debug('remaining buffer for socket [' + conn.id + '] not exists.');
        }
        
        
        
        // convert Buffer to String
        let data_str = data.toString('utf8');
        
        let length_str;
        let body_str = data_str;

        length_str = data_str.substr(0, 10);
        body_str = data_str.substr(10);
        logger.debug('length string : ' + length_str);
        //logger.debug('length string : ' + length_str + ', body string : ' + body_str);


        // convert length string to integer
        let body_length = parseInt(length_str);
        logger.debug('body length : ' + body_length);
        if (!body_length) {
            logger.debug('body length is not invalid.');
            return;
        }
        
        // compare length integer and data length
        //var body_buffer_length = body_str.length;
        let body_buffer = Buffer.from(body_str, 'utf8');
        let body_buffer_length = body_buffer.length;
        logger.debug('compared length : ' + body_buffer_length + ', ' + body_length);
        
        if (body_buffer_length < body_length) {
            logger.debug('body buffer is not completed.');

            // put the remaining data to the remaining hash
            let remainingBuffer = Buffer.from(data, 'utf8');
            this.remainingMap.set(conn.id, remainingBuffer);
            
        } else if (body_buffer_length == body_length) {
            logger.debug('body buffer is completed.');

            // parse TEST
            logger.debug('converting body data for TEST.');
            
            try {
                //logger.debug('BODY STRING -> ' + body_str);
                const firstDigit = body_str[0];
                logger.debug('first digit : ' + body_str[0]);

                if (firstDigit !== '{') {
                    logger.debug('first digit is not begin brace... trimmed...');
                    body_str = body_str.substr(1);
                }


                let bodyObj = JSON.parse(body_str);
                //console.dir(bodyObj);
            } catch(err) {
                logger.debug('Error occurred in parsing data.');
                console.dir(err);
                
                return;
            }
            
            // remove remaining data
            this.remainingMap.remove(conn.id);
            
            // process completed
            
            // release connection to pool
            try {
                conn.release();
                logger.debug('connection released.');
            } catch(err) {
                logger.debug('error in releasing connection -> ' + JSON.stringify(err));
            }

            this.processCompleted(res, conn, paramRequestCode, values, body_str, callback);
            
            
        } else {
            logger.debug('bytes remained after body buffer.');
            
            // split body string
            let curBodyStr = body_str.substr(0, body_length);
            let remainingStr = body_str.substr(body_length);
            
            // process completed
            
            // release connection to pool
            try {
                conn.release();
                logger.debug('connection released.');
            } catch(err) {
                logger.debug('error in releasing connection -> ' + JSON.stringify(err));
            }

            processCompleted(res, conn, paramRequestCode, values, curBodyStr, callback);
    

            // put the remaining data to the remaining hash
            let remainingBuffer = Buffer.from(remainingStr, 'utf8');
            this.remainingMap.set(conn.id, remainingBuffer);
            
            processData(res, conn, paramRequestCode, values, Buffer.from(''), processCompleted, callback);
        }
        
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
        logger.debug('query called.');
        logger.debug('values.input -> ' + JSON.stringify(values.input));

        try {
            // external 객체 참조
            let external;
            if (values.req) {
                external = values.req.app.get('external');
            }

            // external의 mci 참조
            if (external.mci) {
                
                external.mci.send(
                    values,
                    (conn, err, result) => {
                        if (err) {
                            try {
                                conn.release();
                                logger.debug('connection released.');
                            } catch(err) {
                                //logger.debug('error in releasing connection -> ' + JSON.stringify(err));
                            }

                            //logger.warn('exception in sending -> ' + JSON.stringify(err));
                            //logger.warn('this can be normal status because of socket disconnect.');
                            //this.sendError(values.res, values.params.requestCode, 'send 실패', err);
                        
                            return;
                        }
                        
                        logger.debug('send request done -> ' + result);
                    },
                    (conn, event, received) => {
                        logger.debug('received event : ' + event);
                        //logger.debug('received data : ' + received);
    
                        
                        this.processData(values.res, conn, values.params.requestCode, values, received, this.processCompleted, callback);
                    }
                );
                
            } else {
                logger.error('external.mci 객체가 없습니다.');

                if (callback) {
                    callback('external.mci 객체가 없습니다.', null);
                } else {
                    this.sendErrorString(values.res, values.params.requestCode, 'send 실패', 'external.mci 객체가 없습니다.');
                }
            }
            
        } catch(err) {
            logger.error('exception in sending -> ' + err);

            if (callback) {
                callback('exception in sending -> ' + err);
            } else {
                this.sendError(values.res, values.params.requestCode, 'send 실패', err);
            }

        }	
            
    }


    async processCompleted(res, conn, paramRequestCode, values, received, callback) {
        logger.debug('processCompleted called.');
        
        // convert Buffer to string
        let receivedStr = received.toString();
        logger.debug('output -> ' + receivedStr);

        
        // process MCI response
        let output = await this.processResponse(values, receivedStr, callback);
        if (output) {
            if (callback) {
                callback(null, output);
            } else {
                this.sendSuccess(res, paramRequestCode, 'send 성공', output);
            }
        } else {
            if (callback) {
                callback('no output', null);
            } else {
                this.sendErrorString(res, paramRequestCode, 'no output', '');
            }
        }
         
    }


    async processResponse(values, receivedStr, callback) {
        return new Promise((resolve, reject) => {
            logger.debug('processResponse called.');
            
            try {
                let mciObj = JSON.parse(receivedStr);
        
                let keys = Object.keys(mciObj);
                logger.debug('KEYS -> ' + JSON.stringify(keys));

                let table = {};
                table.header = this.parseHeader(mciObj);
                logger.debug('HEADER -> ' + JSON.stringify(table.header));
        
                // JU START 2018-03-28
                if(table.header.errMessage && table.header.errMessage.length > 0) {                   
                    //this.sendErrorString(values.res, values.params.requestCode, 'MCI 오류', table.header.errMessage);
                    reject('MCI 오류 -> ' + table.header.errMessage)
                } else {
                    table.body = this.parseBody(values, mciObj, table.header, callback);
                    //logger.debug('BODY -> ' + JSON.stringify(table.body));  
                }
                // JU END 2018-03-28
        
                resolve(table);

            } catch(err) {
                logger.error('error in processResponse -> ' + err);
                reject('error in processResponse -> ' + err);
            }

        });
    }


    parseHeader(mciObj) {
        logger.debug('parseHeader called.');
        
        let header = {};

        // system header
        // service id -> tlgrRecvSrvcId
        header.serviceId = mciObj.cfs_sheader_001.tlgrRecvSrvcId;

        // user id -> tlgrRecvUserId
        header.userId = mciObj.cfs_sheader_001.tlgrRecvUserId;
        
        // error message
        header.errMessage = '';
        
        // 처리결과구분코드
        let prsgRsltDvsnCd = mciObj.cfs_sheader_001.prsgRsltDvsnCd;
        if(!prsgRsltDvsnCd) {
            prsgRsltDvsnCd = '';
        }
        
        // 인터페이스상태코드
        let inrfSttsCd = mciObj.cfs_sheader_001.inrfSttsCd;
        if(!inrfSttsCd) {
            inrfSttsCd = '';
        }

        if( !(prsgRsltDvsnCd == '1' || prsgRsltDvsnCd == '9') ) {
            let message1 = '';
            let message2 = '';
            let message3 = '';
        
            if(prsgRsltDvsnCd == '2') {
                message1 = 'Business Error';
                message2 = '';
                message3 = 'AP 오류에도 UI 에서 개별부 정보 보기위한 오류 유형. 필요 시 AP server userlog 확인';
            
            } else if(prsgRsltDvsnCd == '5') {
                message1 = 'F/W 오류';
                message2 = 'F/W 오류';
                message3 = '메시지 코드 확인 및 F/W 담당자 문의';
                
            } else if(prsgRsltDvsnCd == '6') {
                message1 = 'TP 오류';
            
                if(inrfSttsCd == '001') {
                    message2 = 'TIMEOUT';
                    message3 = 'TP 서버 상태 확인';
                    
                } else if(inrfSttsCd == '006') {
                    message2 = 'NOENTRY';
                    message3 = 'TP 서버 등록 상태 확인';
                    
                } else if(inrfSttsCd == '010') {
                    message2 = 'SVRERR';
                    message3 = 'TP 서버 상태 확인';
                    
                } else if(inrfSttsCd == '013') {
                    message2 = 'TIMEOUT';
                    message3 = 'TP 서버 상태 확인';
                    
                } else if(inrfSttsCd == '100') {
                    message2 = 'TIMEOUT';
                    message3 = 'TP 서버 상태 확인';
                }
                
            } else if(prsgRsltDvsnCd == '7') {
                message1 = 'I/F 처리 오류';
        
                if(inrfSttsCd == '403') {
                    message2 = 'FORBIDDEN';
                    message3 = 'NO PERMISSION Client IP';
                    
                } else if(inrfSttsCd == '601') {
                    message2 = '파일 오류';
                    message3 = '파일 존재 여부 확인';
                    
                } else if(inrfSttsCd == '602') {
                    message2 = '파일 사이즈 오류';
                    message3 = '전문 로그 확인';
                    
                } else if(inrfSttsCd == '603') {
                    message2 = '파일 권한 오류';
                    message3 = '파일 권한 여부 확인';
                    
                } else if(inrfSttsCd == '901') {
                    message2 = '타임아웃';
                    message3 = '';
                    
                } else if(inrfSttsCd == '902') {
                    message2 = '전문 정합성 오류';
                    message3 = '전문 로그 확인';
                    
                } else if(inrfSttsCd == '903') {
                    message2 = '세션정보 오류';
                    message3 = '세션정보 오류';
                    
                } else if(inrfSttsCd == '920') {
                    message2 = '외부 호출 실패';
                    message3 = 'MCI 담당자 문의';
                    
                } else if(inrfSttsCd == '930') {
                    message2 = '전문 파싱 실패';
                    message3 = '인터페이스의 TP 서비스 미등록';
                    
                } else if(inrfSttsCd == '931') {
                    message2 = '전문 매핑 실패';
                    message3 = '전문 로그 확인';
                    
                } else if(inrfSttsCd == '932') {
                    message2 = '전문 타입 오류';
                    message3 = '전문 로그 확인';
                    
                } else if(inrfSttsCd == '933') {
                    message2 = '전문 버전 오류';
                    message3 = '전문 버전 확인';
                } 
                
            } else if(prsgRsltDvsnCd == '8') {
                message1 = '세션 오류';
            
                if(inrfSttsCd == '961') {
                    message2 = '세션정보 없음';
                    message3 = '재로그인';
                    
                } else if(inrfSttsCd == '962') {
                    message2 = '최대세션 오류';
                    message3 = '재로그인';   
                }
            }
            
            header.errMessage = '서비스ID : ' + header.serviceId + '\n처리결과구분코드 : [' + prsgRsltDvsnCd + '] ' + message1 + '\n인터페이스상태코드 : [' + inrfSttsCd + '] ' + message2 + '조치방안 : ' + message3;
            
            logger.error('MCI 오류\n' + header.errMessage);
        }

        // business header
        // code -> mesgCd
        // message -> mesgCtn
        header.code = mciObj.cfs_bheader_s00.mesgCd;
        header.message = mciObj.cfs_bheader_s00.mesgCtn;
        
        // 메시지코드
        const mesgCd = mciObj.cfs_bheader_s00.mesgCd;
        // 메시지내용
        const mesgCtn = mciObj.cfs_bheader_s00.mesgCtn;
        // 에러프로그램명
        const errPrgmNm = mciObj.cfs_bheader_s00.errPrgmNm;
        // 에러함수명
        const errFuncNm = mciObj.cfs_bheader_s00.errFuncNm;
        // 에러라인번호
        const errLineNo = mciObj.cfs_bheader_s00.errLineNo;
        // 에러SQL번호
        const errSqlNo = mciObj.cfs_bheader_s00.errSqlNo;
        // 에러TP번호
        const errTpNo = mciObj.cfs_bheader_s00.errTpNo;
        // 에러메시지처리구분코드
        const errMesgPrsgDvsnCd = mciObj.cfs_bheader_s00.errMesgPrsgDvsnCd;

        // 응답 결과가 정상이거나 해당정보가 없는 경우 또는 정상 조회되었으나 메세지코드가 비여있는 경우
        if( (mesgCd && mesgCd.trim().length >= 2 && (mesgCd.substring(0, 2) == 'IB' || mesgCtn == '해당 정보가 없습니다.'))
        || (mesgCd.trim().length == 0 && mesgCtn.trim().length == 0 && errPrgmNm.trim().length == 0 && errFuncNm.trim().length == 0 
            && errLineNo.trim().length == 0 && errSqlNo.trim().length == 0 && errTpNo.trim().length == 0 && errMesgPrsgDvsnCd.trim().length == 0) ) {

        // 에러가 발생한 경우 
        } else {
            // EF00001, 프레임워크 수행 오류입니다.
            // EB00004, DB 반영시 오류가 발생하였습니다.
            
            header.errMessage = '서비스ID : ' + header.serviceId + '\n메시지코드 : ' + mesgCd + '\n메시지내용 : ' + mesgCtn + '\n에러프로그램명 : ' + errPrgmNm + '\n에러함수명 : ' + errFuncNm + '\n에러라인번호 : ' + errLineNo + '\n에러SQL번호 : ' + errSqlNo + '\n에러TP번호 : ' + errTpNo + '\n에러메시지처리구분코드 : ' + errMesgPrsgDvsnCd;
                
            logger.error('MCI 오류\n' + header.errMessage);
        } 

        return header;
    }


    parseBody(values, mciObj, header, callback) {
        logger.debug('parseBody called.');
        
        let body;
        
        if(values.inname && values.inname.length > 0) {
            //header.repeat = mciObj[values.inname].afiReptNtm;
            
            logger.debug('outname type : ' + typeof(values.outname));      
            if(typeof(values.outname) == 'string') {
                if (!mciObj[values.inname][values.outname]) {
                    console.error('No data object for ' + values.inname + '.' + values.outname);
                    reject('No data object for ' + values.inname + '.' + values.outname);
                }

                //header.repeat = mciObj[values.inname].afiReptNtm;
                header.repeat = mciObj[values.inname][values.outname].length;
                logger.debug('repeat count : ' + header.repeat);        

                return this.parseData(values, header, mciObj[values.inname][values.outname], callback);
                
            } else if(typeof(values.outname) == 'object' && values.outname.constructor == Array) {
                let arrayDataCnt = values.outname.length;            
                logger.debug('array data count : ' + arrayDataCnt);

                return this.parseArrayData(values, header, mciObj, values.inname, values.outname, callback); 
            }
            
        } else {
            return this.parseItem(values, header, mciObj[values.outname], callback);
        }
        
    }


    parseData(values, header, rows, callback) {
        logger.debug('parseData called.');
        
        let output = [];
        
        try {
            if (values.mapper) {
                logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                rows.forEach((item, index) => {
                    let outputItem = {};
                    Object.keys(values.mapper).forEach((key, position) => {
                        try {
                            if (index == 0) {
                                logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[key] + '] : ' + item[values.mapper[key]]);
                            }
                            
                            outputItem[key] = item[values.mapper[key]];
                            if (!outputItem[key]) {
                                outputItem[key] = item[values.mapper[key].toUpperCase()] || item[values.mapper[key].toLowerCase()];
                            }

                            //logger.debug('item value -> ' + outputItem[key]);
                            //logger.debug('item value typeof -> ' + typeof(item[values.mapper[key]]));
                            
                        } catch(err2) {
                            logger.debug('mapping error : ' + JSON.stringify(err2));
                        }
                    });

                    output.push(outputItem);
                });
            } else {
                logger.debug('mapper not found. query result will be set to output.');
                output = rows;
            }
            
            logger.debug('OUTPUT -> ' + JSON.stringify(output));

            //if (callback) {
            //    callback(output);
            //} else {
            //    this.sendSuccess(values.res, values.params.requestCode, values.inname + ':' + values.outname + ' success', output);
            //}

            return output;
        
        } catch(err) {
            logger.error('error in processResponse -> ' + JSON.stringify(err));

        }

    }


    parseItem(values, header, item, callback) {
        logger.debug('parseItem called.');
        
        let output = [];
        
        try {
            if (values.mapper) {
                logger.debug('mapper found with attributes ' + Object.keys(values.mapper).length);
                let outputItem = {};
                Object.keys(values.mapper).forEach((key, position) => {
                    try {
                        if (position == 0) {
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

                output.push(outputItem);
            } else {
                logger.debug('mapper not found. query result will be set to output.');
                output = rows;
            }
            
            logger.debug('OUTPUT -> ' + JSON.stringify(output));

            return output;
        
        } catch(err) {
            logger.error('error in processResponse -> ' + JSON.stringify(err));
        }
        
    }



    parseArrayData(values, header, mciObj, inname, outname, callback) {
        logger.debug('parseArrayData called.');
        
        let output = [];

        try {
            if (values.mapper) {
                outname.forEach((oname, oindex) => {
                    logger.debug('array data #' + oindex + ' [' + oname + ']');
                    header.repeat = mciObj[values.inname][oname].length;
                    logger.debug('repeat count : ' + header.repeat);

                    let itemput = [];
                    
                    logger.debug('mapper found with attributes ' + Object.keys(values.mapper[oindex]).length);
                    mciObj[values.inname][oname].forEach((item, index) => {
                        let outputItem = {};
                        Object.keys(values.mapper[oindex]).forEach((key, position) => {
                            try {
                                if (index == 0) {
                                    logger.debug('mapping #' + position + ' [' + key + '] -> [' + values.mapper[oindex][key] + ']');
                                }

                                outputItem[key] = item[values.mapper[oindex][key]];
                                if (!outputItem[key]) {
                                    outputItem[key] = item[values.mapper[oindex][key].toUpperCase()] || item[values.mapper[oindex][key].toLowerCase()];
                                }
                            } catch(err2) {
                                logger.debug('mapping error : ' + JSON.stringify(err2));
                            }
                        });

                        itemput.push(outputItem);
                    });
                    
                    output.push(itemput);
                });
                

            } else {
                logger.debug('mapper not found. query result will be set to output.');
                
                outname.forEach((oname, oindex) => {
                    logger.debug('array data #' + oindex + ' [' + oname + ']');
                    header.repeat = mciObj[values.inname][oname].length;
                    logger.debug('repeat count : ' + header.repeat);

                    output.push(mciObj[values.inname][oname]);
                });
            }
            
            logger.debug('OUTPUT -> ' + JSON.stringify(output));

            //if (callback) {
            //    callback(output);
            //} else {
            //    this.sendSuccess(values.res, values.params.requestCode, values.inname + ':' + values.outname + ' success', output);
            //}
        
            return output;

        } catch(err) {
            logger.error('error in processResponse -> ' + JSON.stringify(err));
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
            //logger.debug(JSON.stringify(result));
        }
        
        let response = {
            requestCode:requestCode,
            code:code,
            message:message,
            resultType:resultType,
            resultFormat:resultFormat,
            resultProtocol:resultProtocol,
            resultVersion:resultVersion,
            result:result
        }
        
        let responseStr = JSON.stringify(response);
        
        try {
            res.status(code).send(responseStr);
        } catch(err) {
            //logger.error('error in sendResponse -> ' + JSON.stringify(err));
        }
    }
 
}

module.exports = MciUtil;
