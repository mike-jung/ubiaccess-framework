
/*
 * Configuration for socket.io handler
 * 
 * @author Mike
 */
 
let thisModule = [
    {id:'0', file:'chat', method:'login', event:'login'},
    {id:'1', file:'chat', method:'logout', event:'logout'},
	{id:'2', file:'chat', method:'message', event:'message'}
];

thisModule.baseDir = 'socketio';

module.exports = thisModule;

