/*
 * controller loader
 * 
 * @author Mike
 */

'use strict';

const path = require('path');
const fs = require('fs');

const controllerConfig = require('../config/controller_config');

// logger
const logger = require('../util/logger');

const rest_types = ['list', 'create', 'read', 'update', 'delete'];

const loader = {};

// get os
let isMac = false
if (process.platform == "darwin") {
    isMac = true
}

// controller directory
let controllerDir = __dirname + '\\..\\controllers'
if (isMac) {
    controllerDir = __dirname + '/../controllers'
}

loader.load = (router, upload) => {
    //logger.debug('load called.');

    // auto loading with annotations
    loader.autoLoad(router, upload);

    controllerConfig.forEach((item, index) => {
        // print out item's attributes
        if (item.type === 'rest') {
            //logger.debug(`#${index} -> id:${item.id}, type:${item.type}, base:${item.base}, unit:${item.unit}`);
        } else if (item.type === 'path') {
            //logger.debug(`#${index} -> id:${item.id}, type:${item.type}, path:${item.path}, method:${item.method}, file:${item.file}, func:${item.func}`);
        } else {
            //logger.debug(`#${index} -> Unknown item type, id:${item.id}, type:${item.type}`);
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
                //logger.debug('rest type #' + restIndex + ' -> ' + restType);
            
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
                //logger.debug(`rest request method -> ${restRequestMethod}, path -> ${restPath}, func -> ${restType}`);

                router.route(restPath)[restRequestMethod](controller[restType].bind(controller));
            });

        } else if (item.type == 'path') {
            const Controller = require('../controllers/' + item.file);
            const controller = new Controller();
            
            if (controller[item.func]) {
                item.method.forEach((methodItem, methodIndex) => {
                    //logger.debug('method #' + methodIndex + ' -> ' + methodItem);
                
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
    //logger.debug('autoLoad called.');

 
    // load annotation definition
    let RegistryPath = __dirname + '\\..\\lib\\annotation\\registry'
    let ReaderPath = __dirname + '\\..\\lib\\annotation\\reader'
    
    if (isMac) {
        RegistryPath = __dirname + '/../lib/annotation/registry'
        ReaderPath = __dirname + '/../lib/annotation/reader'
    }

    const Registry = require(RegistryPath)
    const Reader = require(ReaderPath)
    

    const registry = new Registry()
    const reader = new Reader(registry)
    

    let myClassPath = __dirname + '\\..\\lib\\annotation\\definition\\my-class.js'
    let myMethodPath = __dirname + '\\..\\lib\\annotation\\definition\\my-method.js'
    
    if (isMac) {
        myClassPath = __dirname + '/../lib/annotation/definition/my-class.js'
        myMethodPath = __dirname + '/../lib/annotation/definition/my-method.js'
    }

    registry.registerAnnotation(myClassPath)
    registry.registerAnnotation(myMethodPath)
    
    
    // check all controllers
    fs.readdir(controllerDir, (err, filenames) => {
        if (err) {
            logger.debug('Unable to scan controller directory: ' + err);
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
    //logger.debug('Controller file path -> ' + filePath);

    reader.parse(filePath)
    
    const definitionAnnotations = reader.definitionAnnotations
    //logger.debug('definitionAnnotations -> ' + JSON.stringify(definitionAnnotations));

    const methodAnnotations = reader.methodAnnotations
    //logger.debug('methodAnnotations -> ' + JSON.stringify(methodAnnotations));
    
    if ((definitionAnnotations == undefined || (definitionAnnotations.length == 0)) 
        && (methodAnnotations == undefined || (methodAnnotations.length == 0))) {
        return;
    }

    if (definitionAnnotations.length > 0) {
       // logger.debug('\n@Controller : ' + definitionAnnotations.length)
    }

    const classMapping = {};
    let isRest = false;
    let restPath;
    let restFilePath;
    let table;
    for (let i = 0; i < definitionAnnotations.length; i++) {
        const annotation = definitionAnnotations[i];
        //logger.debug('#' + i + ' : class name -> ' + annotation.target);
        //logger.debug('#' + i + ' : path -> ' + annotation.path);
        //logger.debug('#' + i + ' : type -> ' + annotation.type);
        //logger.debug('#' + i + ' : table -> ' + annotation.table);

        if (annotation.type == 'rest') {
            isRest = true;
            restPath = annotation.path;

            const curExtension = path.extname(annotation.filePath);
            const curFilename = path.basename(annotation.filePath, curExtension);
            restFilePath = '../controllers/' + curFilename;

            table = annotation.table;
        }

        classMapping[annotation.target] = annotation.path;
    };
    //logger.debug('class mapping -> ' + JSON.stringify(classMapping)); 

    // register REST type controller
    if (isRest) {
        loader.registerRest(router, restFilePath, restPath, table);
    }


    // register methods
    if (methodAnnotations.length > 0) {
        //logger.debug('\n@RequestMapping : ' + methodAnnotations.length)
    }

    for (let i = 0; i < methodAnnotations.length; i++) {
        const annotation = methodAnnotations[i];
        //logger.debug('#' + i + ' : function name -> ' + annotation.target);
        //logger.debug('#' + i + ' : path -> ' + annotation.path);
        //logger.debug('#' + i + ' : method -> ' + annotation.method);
        //logger.debug('#' + i + ' : upload -> ' + annotation.upload);

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

loader.registerRest = (router, filePath, path, table) => {
    //logger.debug('registerRest called : ' + path + ' -> in file ' + filePath + ', table : ' + table);

    let Controller;
    let controller

    // load pre-defined Controller class if table is designated
    if (table) {
        Controller = require('./table-controller');
        controller = new Controller(table, path);
    } else {
        Controller = require(filePath);
        controller = new Controller();
    }

    rest_types.forEach((restType, restIndex) => {
        //logger.debug('rest type #' + restIndex + ' -> ' + restType);
    
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
        //logger.debug(`rest request method -> ${restRequestMethod}, path -> ${restPath}, func -> ${restType}`);

        router.route(restPath)[restRequestMethod](controller[restType].bind(controller));
    });
}


loader.registerPath = (router, upload, filePath, func, method, path, uploadFlag) => {
    //logger.debug('registerPath called : ' + path + ' -> ' + func + ' in file ' + filePath);

    const Controller = require(filePath);
    const controller = new Controller();
    
    if (controller[func]) {
        method.forEach((methodItem, methodIndex) => {
            //logger.debug('method #' + methodIndex + ' -> ' + methodItem);
        
            if (methodItem) {
                methodItem = methodItem.trim();
            }

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
