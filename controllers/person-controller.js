'use strict';

import Person from '../models/person';
import PersonService from '../services/person-service';

import param from '../util/param';
import util from '../util/util';
import logger from '../util/logger';

const personService = new PersonService();

class PersonController {

    constructor() {
        logger.debug(`PersonController initialized.`);
    }

    /**
     * This function list persons
     * 
     * @route GET /person
     * @group person - Operations about person
     * @param {string} id person's id
     * @param {string} name person's name
     * @param {number} age person's age
     * @param {string} mobile person's mobile
     * @returns {object} 200 - An array of person info
     * @returns {Error}  default - Unexpected error
     */
	async list(req, res) {
        logger.debug('PersonController:list called.');
        const params = param.parse(req);

        try {
            const rows = await personService.doList(req, res, params);
            util.sendRes(res, 200, 'OK', rows);
        } catch(err) {
            util.sendError(res, 400, err);
        }
 
	}
 
    /**
     * This function get a person
     * 
     * @route GET /person/{id}
     * @group person - Operations about person
     * @param {string} id.path.required person's id
     * @param {string} name person's name
     * @param {number} age person's age
     * @param {string} mobile person's mobile
     * @returns {object} 200 - An array of person info
     * @returns {Error}  default - Unexpected error
     */
	async read(req, res) {
        logger.debug('PersonController:read called.');
        const params = param.parse(req);
 
        try {
            const rows = await personService.doRead(req, res, params);
            util.sendRes(res, 200, 'OK', rows);
        } catch(err) {
            util.sendError(res, 400, err);
        }
 
	}
 
    /**
     * This function creates a person
     * 
     * @route POST /person
     * @group person - Operations about person
     * @param {string} id.query.required person's id
     * @param {string} name person's name
     * @param {number} age person's age
     * @param {string} mobile person's mobile
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	async create(req, res) {
        logger.debug('PersonController:create called.');
        const params = param.parse(req);
  
        try {
            const rows = await personService.doCreate(req, res, params);
            util.sendRes(res, 200, 'OK', rows);
        } catch(err) {
            util.sendError(res, 400, err);
        }
 
	}
 
    /**
     * This function updates a person
     * 
     * @route PUT /person/{id}
     * @group person - Operations about person
     * @param {string} id.path.required person's id
     * @param {string} name person's name
     * @param {number} age person's age
     * @param {string} mobile person's mobile
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	async update(req, res) {
        logger.debug('PersonController:update called.');
		const params = param.parse(req);
   
        try {
            const rows = await personService.doUpdate(req, res, params);
            util.sendRes(res, 200, 'OK', rows);
        } catch(err) {
            util.sendError(res, 400, err);
        }
 
    }
    
    /**
     * This function deletes a person
     * 
     * @route DELETE /person/{id}
     * @group person - Operations about person
     * @param {string} id.path.required person's id
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	async delete(req, res) {
        logger.debug('PersonController:delete called.');
        const params = param.parse(req);

        try {
            const rows = await personService.doDelete(req, res, params);
            util.sendRes(res, 200, 'OK', rows);
        } catch(err) {
            util.sendError(res, 400, err);
        }
 
    }
    
}

module.exports = PersonController;