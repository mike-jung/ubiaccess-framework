'use strict';
 
import database from '../database/database';
import util from '../util/util';
import param from '../util/param';
 
class ProfileController {

    constructor() {
        console.log(`ProfileController initialized.`);
    }

    /**
     * This function get a profile
     * 
     * @route GET /profile/get
     * @group profile - Operations about profile
     * @param {string} name.query.required profile's name
     * @returns {object} 200 - An array of profile info
     * @returns {Error}  default - Unexpected error
     */
    /**
     * This function get a profile
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
		database.executeSql(sqlName, params, (err, rows) => {
			if (err) {
				console.log('executeSql error -> ' + err);
				util.sendError(res, 400, 'executeSql error -> ' + err);

				return;
			}
			
			const output = JSON.stringify(rows);
			util.sendResponse(res, output);
		});
	}
 
    /**
     * This function creates a profile
     * 
     * @route POST /profile/add
     * @group profile - Operations about profile
     * @param {string} id.query.required profile's id
     * @param {string} name profile's name
     * @param {number} age profile's age
     * @param {string} mobile profile's mobile
     * @returns {object} result
     * @returns {Error}  default - Unexpected error
     */
	add(req, res) {
        const params = param.parse(req);
    
		const sqlName = 'person_add';
		database.executeSql(sqlName, params, (err, rows) => {
			if (err) {
				console.log('executeSql error -> ' + err);
				util.sendError(res, 400, 'executeSql error -> ' + err);

				return;
			}

			const output = JSON.stringify(rows);
			util.sendResponse(res, output);
		});
	}
 
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
					return;
				}
	
				console.log('File copied : ' + newFile);
	
				// include uploaded file path
				const output = {
					code:200,
					message:'OK',
					filename:'/images/' + req.files[0].filename
				}
	
				util.sendResponse(res, JSON.stringify(output));
	
			})
		}	
	}
  
}

module.exports = ProfileController;