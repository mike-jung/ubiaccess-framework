'use strict';

/**
 * TechTown Boilerplate starter
 * 
 * External interface module
 * MCI access
 * 
 * @author Mike
 */ 

const logger = require('../util/logger');

const uuid = require('node-uuid');
const moment = require('moment');
 
class MCI {

    constructor(inApp, inConfig, externalConfig, external) {
        logger.debug(`MCI initialized.`);
        
        this.app = inApp;
        this.config = inConfig;
        
        const name = externalConfig.name;
        logger.debug('name : ' + name);
        this.pool = external.pools[name];
        
    }
 

    // Request send
    send(values, callback, receiver) {
        logger.debug('mci.send called.');
        
        // create request body
        let request = {};
        request['cfs_sheader_001'] = this.createSystemHeader(values.interfaceId);
        request['cfs_bheader_s00'] = this.createBusinessHeader();
        request[values.requestId] = values.input;    

        const requestStr = JSON.stringify(request);
        logger.debug(`Request -> ${JSON.stringify(requestStr)}`);

        // check length
        let dataLen = requestStr.length;
        let dataLenStr = dataLen.toString();
        for (let i = 0; i < 10; i++) {
            if (dataLenStr.length < 10) {
                dataLenStr = '0' + dataLenStr;
            } else {
                break;
            }	
        }
        let prefix = dataLenStr;
        let output = prefix + requestStr;

        this.sendData(output, callback, receiver);
        
    }

    createSystemHeader(interfaceId) {
        logger.debug('createSystemHeader called.');

        const systemHeader = {
            tlgrLngtVl:'',
            uuid:uuid.v1(),
            tlgrPrgrNo:'1',
            tlgrTypeCd:'Q',
            inrfId:interfaceId,
            tlgrRqstDt:moment().format('YYYYMMDDHHmmssSSS') + '000',
            lnkdSystInfmVl:'',
            sesnId:'',
            tlgrRqstSystIp:'119.6.3.92',
            tlgrMediDvsnCd:'MO',
            tlgrRqstSystId:'bm0',
            tlgrTrnmSrvcId:'DRS_100000_1001',
            tlgrTrnmUserId:'MOBILE',
            tlgrRecvSrvcId:'',
            tlgrRecvUserId:'',
            prsgRsltDvsnCd:'',
            filePrsgYn:'',
            syncPrsgDvsnCd:'S',
            ectnYn:'N',
            cmrnYn:'N',
            systEnvrDvsnCd:'D',
            testTlgrYn:'N',
            inrfSttsCd:'',
            wndoHndeId:'',
            dataInfmYn:'',
            tlgrVrsnCeckYn:'',
            rqstTlgrVrsnNo:'',
            rspnTlgrVrsnNo:'',
            cmrnTrgtYn:'',
            systHedrRmrkVl:''
        };
        
        return systemHeader;
    }

    createBusinessHeader() {
        logger.debug('createBusinessHeader called.');

        const businessHeader = {
            evntTypCd:'',
            hsptCd:'',
            cntrCd:'',
            dprtCd:'',
            natnCd:'ko',
            lnggCd:'KR',
            aftrMtrlExstYn:'',
            mxmmRqstVl:'',
            mesgCd:'',
            mesgCtn:'',
            adddMesgCd:'',
            adddMesgCtn:'',
            errPrgmNm:'',
            errFuncNm:'',
            errLineNo:'',
            errSqlNo:'',
            errTpNo:'',
            errMesgPrsgDvsnCd:'',
            excfCd:'',
            dtlsExcfCd:'',
            mesgMngmDvsnYn:'',
            userId:'MOBILE',
            scryAplyYn:'',
            bswrHedrRmrkVl:''
        };
        
        return businessHeader;
    }


    sendData(output, callback, receiver) {
        logger.debug('sendData called.');

        // get connection from connection pool
        this.pool.getConnection((err, conn) => {
            if (err) {
                callback(conn, err, null);
                
                return;
            } 
            
            const curId = uuid.v1();
            conn.id = curId;
            logger.debug('Client connection ID : ' + conn.id);
            
            // data transfer
            logger.debug('about to send output.');
            conn._socket.write(output);
            callback(conn, null, 'output sent.');
            
            // check connection in Pool
            logger.debug('all before release : ' + this.pool._allConnections.length);
            logger.debug('free before release : ' + this.pool._freeConnections.length);

        },
        receiver);
        
    }

}

module.exports = MCI;
