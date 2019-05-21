'use strict';

import Database from '../database/database_mysql';
import util from '../util/util';

class PersonService {

    constructor() {
        this.database = new Database('database_mysql');
    }

    async list(req, res, params, callback) {
        console.log('PersonService:list called.');

        try {
            const sqlName = 'person_list';
            const rows = await this.database.execute(sqlName, params);

            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async read(req, res, params, callback) {
        console.log('PersonService:read called.');

        try {
            const sqlName = 'person_read';
            const rows = await this.database.execute(sqlName, params);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async create(req, res, params, callback) {
        console.log('PersonService:create called.');

        try {
            const sqlName = 'person_create';
            const rows = await this.database.execute(sqlName, params);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async update(req, res, params, callback) {
        console.log('PersonService:update called.');

        try {
            const sqlName = 'person_update';
            const rows = await this.database.execute(sqlName, params);
            
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

    async delete(req, res, params, callback) {
        console.log('PersonService:delete called.');

        try {
            const sqlName = 'person_delete';
            const rows = await this.database.execute(sqlName, params);
           
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

}

module.exports = PersonService;