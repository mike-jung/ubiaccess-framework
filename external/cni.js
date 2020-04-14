/*
 * CNI processing
 *
 * @author Mike
 */
 
let logger = require('../util/logger');
 
let axios = require('axios');
  

class CNI {

    constructor(inApp, inConfig, externalConfig, external) {
        logger.debug(`CNI initialized.`);
            
        this.app = inApp;
        this.config = inConfig;
        
        this.serverName = externalConfig.name;
        logger.debug('server name : ' + this.serverName);
        
        this.serverHost = externalConfig.host;
        this.serverPort = externalConfig.port;
        logger.debug('server host : ' + this.serverHost);
        logger.debug('server port : ' + this.serverPort);
        
    }
 

    
    // Request send
    async send(reqMethod, reqPath, params, callback) {
        logger.debug('cni.send called.');

        let url = 'http://' + this.serverHost + ':' + this.serverPort + reqPath;
        
        let requestInfo = {
            method: reqMethod,
            url: url,
            //params: params,  // CNI uses body instead of query even in case of GET method
            data: params,
            responseType: 'json'
        };
        
        logger.debug('request -> ' + JSON.stringify(requestInfo));
        
        
        // send request using axios
        try {
            const response = await axios(requestInfo);

            logger.debug('Response data type -> ' + typeof(response.data));
            logger.debug(response.data);

            let responseData = response.data;
            if (typeof(responseData) == 'string') {
                responseData = JSON.parse(response.data);
            } else if (typeof(responseData) == 'object') {
                responseData = response.data;
            }

            callback(null, responseData);
 
        } catch(error) {
            logger.debug('Error -> ' + error);
            callback(error, null);
        }
        
    }





    /*
    // Request send
    send(reqMethod, reqPath, params, callback) {
        logger.debug('cni.send called.');

        let url = 'http://' + this.serverHost + ':' + this.serverPort + reqPath;
        
        let requestObj = {
            method: reqMethod,
            responseType: 'json',
            url: url
        };
        
        logger.debug('request -> ' + JSON.stringify(requestObj));
        
        
        // send request using axios
        try {
            axios.get(
                requestObj.url,
                {
                    responseType:'json',
                    params: params,
                    headers: {
                        Authorization: 'Bearer ' + "f8ecf5e7-d9c8-3b93-9127-0a7ef7ca20f7" //the token is a variable which holds the token
                    }
                },
            ).then(function (response) {
                logger.debug('Response data type -> ' + typeof(response.data));
                logger.debug(response.data);

                let responseData = response.data;
                if (typeof(responseData) == 'string') {
                    responseData = JSON.parse(response.data);
                }

                callback(null, responseData);

            }).catch(function (error) {
                logger.debug('Error -> ' + error);

                callback(error, null);
            });
        } catch(err) {
            logger.debug('Error -> ' + err);
        }
        
    }
    */

}


module.exports = CNI;
