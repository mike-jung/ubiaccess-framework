'use strict';

import controllerConfig from '../config/controller_config';

// logger
import logger from '../util/logger';

const rest_types = ['list', 'create', 'read', 'update', 'delete'];

const loader = {};

loader.load = (router, upload) => {
    logger.debug('load called.');

    controllerConfig.forEach((item, index) => {
        // print out item's attributes
        if (item.type === 'rest') {
            logger.debug(`#${index} -> id:${item.id}, type:${item.type}, base:${item.base}, unit:${item.unit}`);
        } else if (item.type === 'path') {
            logger.debug(`#${index} -> id:${item.id}, type:${item.type}, path:${item.path}, method:${item.method}, file:${item.file}, func:${item.func}`);
        } else {
            logger.debug(`#${index} -> Unknown item type, id:${item.id}, type:${item.type}`);
        }
        
        if (item.type == 'rest') {
            const filename = '../controllers/' + item.unit + '-controller';
            
            let Controller = require(filename);
            if (!Controller) {
                logger.debug(`The controller file ${filename} not exist.`);
                return;
            }

            const controller = new Controller();

            rest_types.forEach((restType, restIndex) => {
                logger.debug('rest type #' + restIndex + ' -> ' + restType);
            
                let restPath = item.base + '/';
                let restRequestMethod = '';
                if (restType == 'list') {
                    restPath += item.unit;
                    restRequestMethod = 'get';
                } else if (restType == 'create') {
                    restPath += item.unit;
                    restRequestMethod = 'post';
                } else if (restType == 'read') {
                    restPath += item.unit + '/:id';
                    restRequestMethod = 'get';
                } else if (restType == 'update') {
                    restPath += item.unit + '/:id';
                    restRequestMethod = 'put';
                } else if (restType == 'delete') {
                    restPath += item.unit + '/:id';
                    restRequestMethod = 'delete';
                }
                logger.debug(`rest request method -> ${restRequestMethod}, path -> ${restPath}, func -> ${restType}`);

                router.route(restPath)[restRequestMethod](controller[restType]);
            });

        } else if (item.type == 'path') {
            const Controller = require('../controllers/' + item.file);
            const controller = new Controller();
            
            item.method.forEach((methodItem, methodIndex) => {
                logger.debug('method #' + methodIndex + ' -> ' + methodItem);
            
                // in case of file upload controller
                if (item.upload) {
                    router.route(item.path)[methodItem](upload.array('photo', 1), controller[item.func]);
                } else {
                    router.route(item.path)[methodItem](controller[item.func]);
                }
            });
        } else {
            logger.debug(`Unknown controller type -> ${item.type}`);
        }
        
    })
    
}

module.exports = loader;