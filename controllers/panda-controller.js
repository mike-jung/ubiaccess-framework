/**
 * This controller manipulate complex SQL such as conditional where statements.
 * GET http://localhost:7001/panda/list
 * GET http://localhost:7001/panda/list?age=21
 * GET http://localhost:7001/panda/list?age=21&name=john
 * 
 */

'use strict'

import util from '../util/util';
import param from '../util/param';
import logger from '../util/logger';

import Database from '../database/database_mysql';
import TableController from '../loader/table-controller';

/**
 * @Controller(path="/panda")
 */
class Panda {
 
    /**
     * @RequestMapping(path="/list", method="get")
     */
    async list(req, res) {
        logger.debug('Panda:list called for path /panda/list');

        const params = param.parse(req);
        
		try {
            const age = Number(params.age);

			const queryParams = {
                sqlName: 'panda_list',
                sqlReplaces: [
                    'test.person'
                ],
				whereParams: {
                    name: '%' + params.name + '%',
                    age: age
                }
			}
  
			const rows = await super.database.execute(queryParams);

			util.sendRes(res, 200, 'OK', rows);
		} catch(err) {
			util.sendError(res, 400, 'Error in execute -> ' + err);
		}

    }
   
}


module.exports = Panda;
