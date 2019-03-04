'use strict';

import database from '../database/database';
import util from '../util/util';

class PersonService {

    constructor() {
        console.log(`PersonService initialized.`);
    }

    async list(req, res, params, callback) {
        console.log('PersonService:list called.');

        try {
            const sqlName = 'person_list';
            const rows = await database.execute(sqlName, params);

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
            const rows = await database.execute(sqlName, params);
            
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
            const rows = await database.execute(sqlName, params);
            
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
            const rows = await database.execute(sqlName, params);
            
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
            const rows = await database.execute(sqlName, params);
           
            callback(null, rows);
        } catch(err) {
            console.log('Error -> ' + err);
            callback('Error -> ' + err, null);
        }
    }

}

module.exports = PersonService;