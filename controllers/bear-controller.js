/**
 * This controller registers REST API functions automatically using @Controller annotation on Bear.
 *
 * Example request urls are as follows:
 * 
 * (1) http://localhost:7001/bear/list
 * (2) http://localhost:7001/bear/create
 * (3) http://localhost:7001/bear/read/1
 * (4) http://localhost:7001/bear/update/1
 * (5) http://localhost:7001/bear/delete/1
 * 
 */

'use strict'

/**
 * @Controller(path="/bear", type="rest", table="test.person")
 */
class Bear {

}

module.exports = Bear;
