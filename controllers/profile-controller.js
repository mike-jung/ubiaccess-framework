'use strict';
 
import Database from '../database/database_mysql';
import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

class ProfileController {

    constructor() {
			logger.debug(`ProfileController initialized.`);
				
			this.database = new Database('database_mysql');
    }

    /**
     * Get a profile from person table
     * 
     * @route GET /profile/get
     * @group profile - Operations about profile
     * @param {string} name.query.required profile's name
     * @returns {object} 200 - An array of profile info
     * @returns {Error}  default - Unexpected error
     */
    /**
     * Get a profile from person table
     * 
     * @route POST /profile/get
     * @group profile - Operations about profile
     * @param {string} name.body.required profile's name
     * @returns {object} 200 - An array of profile info
     * @returns {Error}  default - Unexpected error
     */
	get(req, res) {
		const params = param.parse(req);

		const sqlName = 'person_get';
		this.database.executeSql(sqlName, params, (err, rows) => {
			if (err) {
				console.log('executeSql error -> ' + err);
				util.sendError(res, 400, 'executeSql error -> ' + err);

				return;
			}
			
			util.sendRes(res, 200, 'OK', rows);
		});
	}
 
    /**
     * Add a profile in person table
	 * This example shows how to call database.execute method
     * 
     * @route GET /profile/add
     * @group profile - Operations about profile
     * @param {string} name profile's name
     * @param {number} age profile's age
     * @param {string} mobile profile's mobile
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	async add(req, res) {
        const params = param.parse(req);
	
		try {
			const sqlName = 'person_add';
			const rows = await this.database.execute(sqlName, params);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

	}

	/*
	async list(req, res) {
        const params = param.parse(req);
	
		try {
			const sqlName = 'person_list';
			const rows = await this.database.execute(sqlName, params);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

	}
	*/

 
	upload(req, res) {
		const params = param.parse(req);

		console.log('FILES');
		console.dir(req.files);
	
		// move uploaded files from uploads folder to public/images folder
		if (req.files.length > 0) {
			var oldFile = './uploads/' + req.files[0].filename;
			var newFile = './public/images/' + req.files[0].filename;
	
			fs.rename(oldFile, newFile, (err) => {
				if (err) {
					console.log('Error in moving file : ' + err);
					util.sendError(res, 400, 'Error in moving file : ' + err);
					return;
				}
	
				console.log('File copied to ' + newFile);
	
				// include uploaded file path
				const output = {
					filename:'/images/' + req.files[0].filename
				}
	
				util.sendRes(res, 200, 'OK', output);
			})
		}	
	}
  
}

module.exports = ProfileController;