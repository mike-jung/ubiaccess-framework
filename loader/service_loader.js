/*
 * service loader
 * 
 * @author Mike
 */

'use strict';

const serviceConfig = require('../config/service_config');

// logger
const logger = require('../util/logger');
 
const loader = {};

loader.load = () => {
    //logger.debug('load in service_loader called.');

    serviceConfig.forEach((item, index) => {
        // print out item's attributes
        //logger.debug(`#${index} -> id:${item.id}, unit:${item.unit}`);
         
        const filename = '../services/' + item.unit + '-service';
        let Service = require(filename);
        if (!Service) {
            logger.debug(`The service file ${filename}.js not exist.`);
            return;
        }
  
        loader.addDoMethods(Service);
    })
    
}


loader.addDoMethods = (klass) => {
    const methodNames = loader.getMethods(klass);
    methodNames.forEach((item, index) => {
        //logger.debug('method #' + index + ' -> ' + item);
    
        const firstChar = item.substring(0, 1).toUpperCase();
        const method = 'do' + firstChar + item.substring(1);
        //logger.debug('    do method name -> ' + method);
 
        klass.prototype[method] = (req, res, params) => {
            return new Promise((resolve, reject) => {
                const curInstance = new klass();
                curInstance[item](req, res, params, (err, result) => {
                    if (err) {
                        reject(err);
                    }

                    resolve(result);
                });
            });
        }

    });
}

loader.getMethods = (klass) => {
    const properties = Object.getOwnPropertyNames(klass.prototype)
    properties.push(...Object.getOwnPropertySymbols(klass.prototype))
    return properties.filter(name => {
        const descriptor = Object.getOwnPropertyDescriptor(klass.prototype, name)
        if (!descriptor) return false
        return 'function' == typeof descriptor.value && name != 'constructor'
    })
}



module.exports = loader;