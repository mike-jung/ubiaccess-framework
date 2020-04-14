/**
 * This controller registers REST API functions automatically using @Controller annotation on Bear class.
 * This controller accesses test.person table and you need it to be defined in MySQL or Maria DB.
 * Schema is as follows.
 *
  
        <test.person> table
        
        id      INT    AUTO_INCREMENT
        name    TEXT
        age     INT
        mobile  TEXT
  
 * 
 * Example request urls are as follows:
 * 
 
    (1) List : GET http://localhost:8001/bear
    (2) Create : POST http://localhost:8001/bear
             Parameters -> name=john, age=20, mobile=010-1000-1000
    (3) Read : GET http://localhost:8001/bear/1
    (4) Update : PUT http://localhost:8001/bear/1
             Parameters -> name=john, age=20, mobile=010-1000-1000
    (5) Delete : DELETE http://localhost:8001/bear/1

 * Pagination, order by and search options are supported.
 * Column names can be sent as request parameters for retrieving only designated columns.

    (1) GET http://localhost:8001/bear?page=1&perPage=10
    (2) GET http://localhost:8001/bear?page=1&perPage=10&search=name&searchValue=john&order=name&orderDirection=asc
    (3) GET http://localhost:8001/bear?columns=id,name

 *
 */

'use strict'

/**
 * @Controller(path="/bear", type="rest", table="test.person")
 */
class Bear {

}

module.exports = Bear;
