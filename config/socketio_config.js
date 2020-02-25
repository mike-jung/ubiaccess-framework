
/*
 * Configuration for socket.io handler
 * 
 * @author Mike
 */
 
let thisModule = [
    {id:'0', file:'chat', method:'login', event:'login'},
    {id:'1', file:'chat', method:'logout', event:'logout'},
    {id:'2', file:'chat', method:'message', event:'message'},
    {id:'3', file:'groupchat', method:'login_group', event:'login_group'},
    {id:'4', file:'groupchat', method:'logout_group', event:'logout_group'},
    {id:'5', file:'groupchat', method:'message_group', event:'message_group'}
];

thisModule.baseDir = 'socketio';

module.exports = thisModule;

