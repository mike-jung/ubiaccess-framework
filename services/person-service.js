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
            const output = JSON.stringify(rows);
            console.log('output -> ' + output);
     
            util.sendResponse(res, output);
        } catch(err) {
            console.log('Error -> ' + err);
            util.sendError(res, 400, err);
        }
    }

    async read(id, req, res, params, callback) {
        console.log('PersonService:read called.');

        try {
            const sqlName = 'person_read';
            const rows = await database.execute(sqlName, params);
            const output = JSON.stringify(rows);
            console.log('output -> ' + output);
     
            util.sendResponse(res, output);
        } catch(err) {
            console.log('Error -> ' + err);
            util.sendError(res, 400, err);
        }
    }

    async create(person, req, res, params, callback) {
        console.log('PersonService:create called.');

        try {
            const sqlName = 'person_create';
            const rows = await database.execute(sqlName, params);
            const output = JSON.stringify(rows);
            console.log('output -> ' + output);
     
            util.sendResponse(res, output);
        } catch(err) {
            console.log('Error -> ' + err);
            util.sendError(res, 400, err);
        }
    }

    async update(person, req, res, params, callback) {
        console.log('PersonService:update called.');

        try {
            const sqlName = 'person_update';
            const rows = await database.execute(sqlName, params);
            const output = JSON.stringify(rows);
            console.log('output -> ' + output);
     
            util.sendResponse(res, output);
        } catch(err) {
            console.log('Error -> ' + err);
            util.sendError(res, 400, err);
        }
    }

    async delete(id, req, res, params, callback) {
        console.log('PersonService:delete called.');

        try {
            const sqlName = 'person_delete';
            const rows = await database.execute(sqlName, params);
            const output = JSON.stringify(rows);
            console.log('output -> ' + output);
     
            util.sendResponse(res, output);
        } catch(err) {
            console.log('Error -> ' + err);
            util.sendError(res, 400, err);
        }
    }

}

module.exports = PersonService;