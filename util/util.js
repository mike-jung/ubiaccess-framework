
const util = {};


util.sendResponse = function (res, output) {
    if (typeof(output) == 'object') {
        output = JSON.stringify(output);
        console.log('output object converted to string.');
    }
    
    res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
    res.end(output);
}

util.sendError = function (res, code, message) {
    const output = {
        code: code,
        message: message
    }

    res.writeHead(200, {'Content-Type':'application/json;charset=utf8'});
    res.end(JSON.stringify(output));
}


module.exports = util;
