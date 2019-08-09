'use strict';
 
import Database from '../database/database_sqlite';
import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

class SqliteController {

    constructor() {
        logger.debug(`SqliteController initialized.`);
        
        this.database = new Database('database_sqlite');
    }

    /**
     * Get a profile from person table
     * 
     * @route POST /_sqlite/execute
     * @group _sqlite - Operations about sqlite server
     * @param {string} requestCode.body.required request code
     * @param {string} sql.body.required database sql
     * @param {string} sqlParams.body.required sql parameters
     * @returns {object} 200 - Output from execute
     * @returns {Error}  default - Unexpected error
     */
	execute(req, res) {
		const params = param.parse(req);

        const sql = params.sql;
        const sqlParams = JSON.parse(params.sqlParams);

        executeRaw(sql, sqlParams, 0, (err, rows) => {
            if (err) {
                logger.debug('Error in executing sql -> ' + JSON.stringify(err));
                util.sendError(res, 400, 'Error in execute -> ' + err);

                return;
            }

            util.sendRes(res, 200, 'OK', rows);
        });

	}
  
}

module.exports = SqliteController;