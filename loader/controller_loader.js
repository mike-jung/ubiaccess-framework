/*
 * controller loader
 * 
 * @author Mike
 */

'use strict';

import path from 'path';
import fs from 'fs';

import controllerConfig from '../config/controller_config';

// logger
import logger from '../util/logger';

const rest_types = ['list', 'create', 'read', 'update', 'delete'];

const loader = {};

// controller directory
const controllerDir = __dirname + '\\..\\..\\controllers'
const distControllerDir = __dirname + '\\..\\controllers'

loader.load = (router, upload) => {
    logger.debug('load called.');

    // auto loading with annotations
    loader.autoLoad(router, upload);

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

                router.route(restPath)[restRequestMethod](controller[restType].bind(controller));
            });

        } else if (item.type == 'path') {
            const Controller = require('../controllers/' + item.file);
            const controller = new Controller();
            
            if (controller[item.func]) {
                item.method.forEach((methodItem, methodIndex) => {
                    logger.debug('method #' + methodIndex + ' -> ' + methodItem);
                
                    // in case of file upload controller
                    if (item.upload) {
                        router.route(item.path)[methodItem](upload.array('photo', 1), controller[item.func].bind(controller));
                    } else {
                        router.route(item.path)[methodItem](controller[item.func].bind(controller));
                    }
                });
            } else {
                logger.debug(`${item.func} not found in the controller.`);
            }    
        } else {
            logger.debug(`Unknown controller type -> ${item.type}`);
        }
        
    })
    
}


loader.autoLoad = (router, upload) => {
    logger.debug('autoLoad called.');

 
    // load annotation definition
    const Registry = require(__dirname + '\\..\\lib\\annotation\\registry')
    const Reader = require(__dirname + '\\..\\lib\\annotation\\reader')
    
    const registry = new Registry()
    const reader = new Reader(registry)
    
    registry.registerAnnotation(__dirname + '\\..\\lib\\annotation\\definition\\my-class.js')
    registry.registerAnnotation(__dirname + '\\..\\lib\\annotation\\definition\\my-method.js')
    
    
    // check all controllers
    fs.readdir(controllerDir, (err, filenames) => {
        if (err) {
            console.log('Unable to scan controller directory: ' + err);
            return;
        } 

        // listing all filenames
        filenames.forEach((filename) => {
            loader.parseFile(router, upload, reader, filename);
        });
    });

}

loader.parseFile = (router, upload, reader, filename) => {

    const filePath = path.join(controllerDir, filename);
    console.log('Controller file path -> ' + filePath);

    reader.parse(filePath)
    
    const definitionAnnotations = reader.definitionAnnotations
    //console.log('definitionAnnotations -> ' + JSON.stringify(definitionAnnotations));

    const methodAnnotations = reader.methodAnnotations
    //console.log('methodAnnotations -> ' + JSON.stringify(methodAnnotations));
    
    if ((definitionAnnotations == undefined || (definitionAnnotations.length == 0)) 
        && (methodAnnotations == undefined || (methodAnnotations.length == 0))) {
        return;
    }

    if (definitionAnnotations.length > 0) {
        console.log('\n@Controller : ' + definitionAnnotations.length)
    }

    const classMapping = {};
    let isRest = false;
    let restPath;
    let restFilePath;
    for (let i = 0; i < definitionAnnotations.length; i++) {
        const annotation = definitionAnnotations[i];
        console.log('#' + i + ' : class name -> ' + annotation.target);
        console.log('#' + i + ' : path -> ' + annotation.path);
        console.log('#' + i + ' : type -> ' + annotation.type);

        if (annotation.type == 'rest') {
            isRest = true;
            restPath = annotation.path;
            
            const curExtension = path.extname(annotation.filePath);
            const curFilename = path.basename(annotation.filePath, curExtension);
            restFilePath = '../controllers/' + curFilename;

        }

        classMapping[annotation.target] = annotation.path;
    };
    //console.log('class mapping -> ' + JSON.stringify(classMapping)); 

    if (isRest) {
        loader.registerRest(router, restFilePath, restPath);
    } else {

        if (methodAnnotations.length > 0) {
            console.log('\n@RequestMapping : ' + methodAnnotations.length)
        }

        for (let i = 0; i < methodAnnotations.length; i++) {
            const annotation = methodAnnotations[i];
            console.log('#' + i + ' : function name -> ' + annotation.target);
            console.log('#' + i + ' : path -> ' + annotation.path);
            console.log('#' + i + ' : method -> ' + annotation.method);
            console.log('#' + i + ' : upload -> ' + annotation.upload);

            if (annotation.method == undefined) {
                annotation.method = ['get', 'post'];
            } else {
                annotation.method = annotation.method.split(',');
            }

            const curExtension = path.extname(annotation.filePath);
            const curFilename = path.basename(annotation.filePath, curExtension);
            let curFilePath = '../controllers/' + curFilename;

            let currentPath = annotation.path;
            if (classMapping[annotation.className]) {
                currentPath = classMapping[annotation.className] + annotation.path;
            }

            loader.registerPath(router, upload, curFilePath, annotation.target, annotation.method, currentPath, annotation.upload);

        }
    
    }

}

loader.registerRest = (router, filePath, path) => {
    logger.debug('registerRest called : ' + path + ' -> in file ' + filePath);

    const Controller = require(filePath);
    const controller = new Controller();

    rest_types.forEach((restType, restIndex) => {
        logger.debug('rest type #' + restIndex + ' -> ' + restType);
    
        let restPath = path;
        let restRequestMethod = '';
        if (restType == 'list') {
            restRequestMethod = 'get';
        } else if (restType == 'create') {
            restRequestMethod = 'post';
        } else if (restType == 'read') {
            restPath += '/:id';
            restRequestMethod = 'get';
        } else if (restType == 'update') {
            restPath += '/:id';
            restRequestMethod = 'put';
        } else if (restType == 'delete') {
            restPath += '/:id';
            restRequestMethod = 'delete';
        }
        logger.debug(`rest request method -> ${restRequestMethod}, path -> ${restPath}, func -> ${restType}`);

        router.route(restPath)[restRequestMethod](controller[restType].bind(controller));
    });
}


loader.registerPath = (router, upload, filePath, func, method, path, uploadFlag) => {
    logger.debug('registerPath called : ' + path + ' -> ' + func + ' in file ' + filePath);

    const Controller = require(filePath);
    const controller = new Controller();
    
    if (controller[func]) {
        method.forEach((methodItem, methodIndex) => {
            logger.debug('method #' + methodIndex + ' -> ' + methodItem);
        
            // in case of file upload controller
            if (uploadFlag) {
                router.route(path)[methodItem](upload.array('photo', 1), controller[func].bind(controller));
            } else {
                router.route(path)[methodItem](controller[func].bind(controller));
            }
        });
    } else {
        logger.debug(`${func} not found in the controller.`);
    }  
}


module.exports = loader;
