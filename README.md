# node-web-starter

This is a boilerplate project for MVC architecture using node, express and MySQL (or MariaDB)

- MVC architecture - Model, View, Controller architecture is designed for general usage
- Autoloading - controllers, services and SQL are loaded automatically if you register them
- SQL management - SQL statements are separated from controllers or services. So they can be managed easily
- ES6 and Promise support - ES6 is used and Promise objects are created automatically if you define services


## Application Structure

  * `config/`
    * ... - Application configuration.
  * `controllers/`
    * ... - Put controllers here.
  * `services/`
    * ... - Put services here.
  * `models/`
    * ... - Put  models here.    
  * `views/`
    * ... - Put views here (ejs default)
  * `utils/`
    * ... - Put utilities here
  * `public/`
    * ... - Put public files in css and js folders
     

## Getting Started

The easiest way to get started is to clone the repository:

```sh
# Get the latest snapshot
$ git clone https://github.com/mike-jung/node-web-starter.git myproject
$ cd myproject

# Install dependencies
$ npm install

$ npm start
```

Connection to MySQL(or Maria DB) is needed:

  * Load the SQL file in database folder using GUI manager tool for MySQL
    (sample_database_person.sql)
  * Change the config/config.js file to set server port and database connection
    Here is an example :
    
```js
// config.js

module.exports = {
    server: {
        port: 7001
    },
    database: {
        type:'mysql',
        host:'localhost',
        port:3306,
        user:'root',
        password:'admin',
        database:'test',
        connectionLimit:10,
        debug:false
    }
}

```
    
Example URL for simple fetch from database is as follows:

  * http://localhost:7001/person
  * http://localhost:7001/profile/get
  * http://localhost:7001/set_cookie


## Auto-loading

There is a fair amount of auto-loading built into this application structure.

  * Registered controllers in config/controller-config.js file will be autoloaded.
  * Registered services in config/service-config.js file will be autoloaded.
      if you defined list method in a service, doList method will be automatically added as a Promise object
  * Registered SQL statements in config/sql-config.js file will be autoloaded.
  
  
## ES2015

This boilerplate uses ES6 syntax with Node.js 10.0, you can check out the [feature available here](https://nodejs.org/en/docs/es6/)


## Configuration

A configuration is designed to register controllers, services, SQL and so on. so it will show components registered. You should add a line after created a new controller. This configuration allows you to quickly find components.

The structure of a controller-configuration is simple. Here is an example :
```js
// controller-config.js

module.exports = [
    {id:1, type:'rest', base:'', unit:'person'},
    {id:2, type:'path', path:'/profile/get', method:['get','post'], file:'profile-controller', func:'get'},
    ...
```

If the type attribute is set to 'rest', methods for REST are registered automatically. (list, read, create, update, delete) The unit attribute is used to find the controller file. For example, if you created person-controller.js file in controllers folder it is designated by 'person'. You should set the file name using the unit attribute registered. The request path for the methods are determined by the standards for REST.

If the type attribute is set to 'path', the method is loaded using path, method, file and func attributes.

  * path - request path
  * method - request method ('GET', 'POST', 'PUT', etc. Multiple methods can be used)
  * file - controller file created
  * func - function in the controller file used for callback method


## Controller

Controller handles client's request.

If you create a controller, it needs to be registered in the config/controller-config.js file. In case you define a controller according to the REST standards, only unit name is needed to register in the configuration file. Unit name is used to find the controller file you created.

- See `controllers/person-controller.js` for REST type controller
- See `controllers/profile-controller.js` for API type controller
- See `controllers/test-controller.js` for cookie and session test


## Service

Service is used to handle dedicated work for controllers.

Methods created for a service are especially supported to be called using Promise object. In other words, Promise objects for REST methods are added automatically. 

If you define `list` method in a service, `doList` method will be automatically added as a Promise object.
(`do` is prepended after the first character of the method is capitalized)

- See `services/person-service.js`


## Model

Model is a representation of database object or schematic model. It means that the parameters sent from client can be used to make a model.

- See `models/person.js`


## SQL Execution

SQL file is separated in the config/sql-config.js file. 

Here is an example :

```js
// sql-config.js

module.exports = {
    person_login: {
        sql: "select \
                id \
            from test.users \
            where id = ? and password = ?",
        params: [
            'id',
            'password'
        ]
    },
    ...
```

The name of SQL attribute is used to determine which SQL statement needs to be executed by controllers or services.
Request parameters from client can be used here and params array let us know which parameter is used for the SQL statement. 

This sql statement can be executed as follows:

```js
// profile-controller.js

async add(req, res) {
  const params = param.parse(req);
	
  try {
    const sqlName = 'person_add';
    const rows = await database.execute(sqlName, params);

    util.sendRes(res, 200, 'OK', rows);
  } catch(err) {
    util.sendError(res, 400, 'Error in execute -> ' + err);
  }

}

```

util/param.js utility parses request parameters regardless of GET or POST request methods. Even URL parameters can be parsed.

