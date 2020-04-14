'use strict';

const Database = require('../database/database_mysql');
const util = require('../util/util');

class PersonService {

    constructor() {
        this.database = new Database('database_mysql');
    }

    async list(req, res, params, callback) {
        console.log('PersonService:list called.');

        try {
            const queryParams = {
				sqlName: 'person_list',
				params: params
            }
            
            const rows = await this.database.execute(queryParams);

            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async read(req, res, params, callback) {
        console.log('PersonService:read called.');

        try {
            const queryParams = {
				sqlName: 'person_read',
				params: params
            }
 
            const rows = await this.database.execute(queryParams);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async create(req, res, params, callback) {
        console.log('PersonService:create called.');

        try {
            const queryParams = {
				sqlName: 'person_create',
				params: params
            }

            const rows = await this.database.execute(queryParams);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async update(req, res, params, callback) {
        console.log('PersonService:update called.');

        try {
            const queryParams = {
				sqlName: 'person_update',
				params: params
            }

            const rows = await this.database.execute(queryParams);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async delete(req, res, params, callback) {
        console.log('PersonService:delete called.');

        try {
            const queryParams = {
				sqlName: 'person_delete',
				params: params
            }

            const rows = await this.database.execute(queryParams);
           
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

}

module.exports = PersonService;