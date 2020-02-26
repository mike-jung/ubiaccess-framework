'use strict';

/**
 * TechTown Boilerplate starter
 * 
 * Logger utility for JSON output
 * 
 * @author Mike
 */ 

const fs = require('fs');
const bunyan = require('bunyan');
const RotatingFileStream = require('bunyan-rotating-file-stream');

const logDir = 'log';

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}


const logger = bunyan.createLogger({
    name: 'server',
    level: 'debug',
    src: true,
    //time: new Date().toLocaleString(),
    streams: [
        {
            type: 'raw',
            stream: new RotatingFileStream({
                path: `${logDir}/server_%Y_%m_%d.log`,
                period: '1d', 
                totalFiles: 400, 
                rotateExisting: true, 
                threshold: '2m',
                gzip: false,
                fieldOrder: ['time','hostname','name','pid','level','src','msg']
            })
        },
        {
            level: 'debug',
            stream: process.stdout
        }
    ]    
});

module.exports = logger;

