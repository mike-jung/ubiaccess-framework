'use strict';

import Person from '../models/person';
import PersonService from '../services/person-service';

import param from '../util/param';

const personService = new PersonService();

class PersonController {

    constructor() {
        console.log(`PersonController initialized.`);
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
	list(req, res) {
        console.log('list called.');
        const params = param.parse(req);

		personService.list(req, res, params, (err, rows) => {
			if (err) {
				return res.json({error: 'Could not retrieve persons.'});
            }
            
			return res.json({persons: rows});
		});
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
	read(req, res) {
        const params = param.parse(req);
 
		personService.read(params.id, req, res, params, (err, rows) => {
			if (err) {
				return res.json({error: 'Could not retrieve persons.'});
            }
            
			return res.json({persons: rows});
		});
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
	create(req, res) {
        const params = param.parse(req);
  
		if (params.id) {
			const person = new Person(params.id, params.name, params.age, params.mobile);

			personService.create(person, req, res, params, (err, result) => {
				if (err) {
					return res.status(500).json({error: 'Something went wrong saving the record.'});
				}
				return res.json({result: `Last inserted id : ${result.insertId}`});
			});
		} else {
			return res.status(400).json({msg: 'Bad request.'});
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
	update(req, res) {
		const params = param.parse(req);
   
		const person = new Person(params.id, params.name, params.age, params.mobile);

		personService.update(person, req, res, params, (err, result) => {
			if (err) {
				return res.status(400).json({message: 'Something went wrong updating the record'});
			}
			return res.json({message: 'Succesfully updated the record!'});
		});
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
	delete(req, res) {
        const params = param.parse(req);

		personService.delete(params.id, req, res, params, (err, result) => {
			if (err) {
				return res.status(400).json({message: 'Something went wrong updating the record'});
			}
			return res.json({message: 'Succesfully updated the record!'});
		});
    }
    
}

module.exports = PersonController;