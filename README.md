# ubiaccess-framework

This is a boilerplate project for MVC architecture using node, express and MySQL (or MariaDB)

- Ready-to-use - This project has enough functions to be used for out-of-the-box real world web services
- MVC architecture - Model, View, Controller architecture is designed for general usage
- Autoloading - Controllers, services and SQL are loaded automatically if you register them
- SQL management - SQL statements are separated from controllers or services. So they can be managed easily
- ES6 and Promise support - ES6 is used and Promise objects are created automatically if you define services
- Spring like annotation support - Controllers can be scanned and loaded automatically with annotation
- Database Failover - Relational databases such as MySQL(MariaDB), SQLite and Oracle are supported and failover features are embedded for easy configuration
- SocketIO - chat implementation using SocketIO messaging is easy because handlers are separated
- WebRTC - audio and video streaming for your multimedia needs are supported
- FCM Push - FCM(Firebase Cloud Messaging) Push functions are supported to send push messages to Android and iOS devices.


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
  * `socketio/`
    * ... - Put SocketIO handlers here    
     

## Getting Started

The easiest way to get started is to clone the repository:

```sh
# Get the latest snapshot
$ git clone https://github.com/mike-jung/ubiaccess-framework.git ubiaccess-framework
$ cd ubiaccess-framework

# Install dependencies
$ npm install
 
```
Or you can use npm install command:
```sh
# Get the latest version
$ npm install ubiaccess-framework --save
 
```

MySQL database and Redis need to be installed first.
After installing database and Redis, you can modify config/config.js file for configuration.

  * Load the sample database schema and sample records file(SQL file for MySQL) in database folder using GUI manager tool such as HeidiSQL (sample_database_person.sql)
  * Change the config/config.js file to set server port and database connection
    Here is an example :
    
```js
// config.js

module.exports = {
    server: {
        port: 8001,
	https: false
    },
    database: {  
        database_mysql: { 
            type: 'mysql',
            failover: true,
            retryStrategy: {
                interval: 2000,
                limit: 3,
                failoverLimit: 3
            },
            master: {
                host:'localhost',
                port:3306,
                user:'root',
                password:'admin',
                database:'test',
                connectionLimit:10,
                debug:false
            },
            slave: {
                host:'localhost',
                port:3306,
                user:'root',
                password:'admin',
                database:'test',
                connectionLimit:10,
                debug:false
            }
        }
    }
}

```

As a simplest configuration file, master and slave has the sample connection information.
Currently, MySQL(MariaDB), SQLite and Oracle database are supported
(oracle module is necessary to be installed and configured if you want to use Oracle)

After finished installation and configuration of database and Redis, you can start the server.

```sh

# Start the server
$ npm start

```

Now you can test if the server started correctly or not.
Example URL for simple response is as follows:

  * http://localhost:8001/tiger/hello
  * http://localhost:8001/dog/list
  * http://localhost:8001/cat/list

Example URL for simple fetch from database is as follows:

  * http://localhost:8001/person
  * http://localhost:8001/profile/get
  * http://localhost:8001/set_cookie


## Errors in installing modules on Windows OS

In case your OS is windows, Python and Visual Studio development environment are needed for several modules. 
The easiest way to setup development environment is to check options in installing Node.js runtime. There are options for installing development environment in Node.js windows installer.

In case you already installed Python and Visual Studio 2012 or later, apply msvs_version option using the following command.

```sh

# Install with options
$ npm install --msvs_version=2019
```


If you installed Node.js already and you don't have both Python and Visual Studio, type the following command before installing modules.
Windows-build-tools module will install both Python and Visual Studio modules automatically.

```sh

# Install windows-build-tools before installing other modules
$ npm install -g windows-build-tools

# Install dependencies
$ npm install

```


## Auto-loading

There is a fair amount of auto-loading built into this application structure.

  * Registered controllers in config/controller-config.js file will be autoloaded.
  * Controllers with annotation will be autoloaded without any configuration. 
  * Registered services in config/service-config.js file will be autoloaded.
      if you defined list method in a service, doList method will be automatically added as a Promise object
  * Registered SQL statements in config/sql-config.js file will be autoloaded.
  
  
## ES2015

This boilerplate uses ES6 syntax with Node.js >= 10.0, you can check out the [feature available here](https://nodejs.org/en/docs/es6/)


## Server Configuration

Basic server configuration is in config/config.js file. You can change server port, backlog and so on.
See the following files to check how to configure server for simple web access, socket.io, redis and external interfaces.

  * config/config-sample1.js
  * config/config-sample2.js
  * config/config-sample3.js files
  

## Controller

Controller handles client's requests.

Controller can be created without any configuration if you use annotation.
Annotation is supported like Spring web framework but it is inside comment for class and methods.

The simplest way to define a controller is to create a new file in controllers folder. Any files in controllers folder will be detected as a controller file and checked if it has @Controller annotation. See the following bear-controller.js file and you can see how it is easy to define a new controller.

  * controllers/bear-controller.js    annotation for class can be set for REST api support
                                      with automatic database access

```js
// bear-controller.js
...

/**
 * @Controller(path="/bear", type="rest", table="test.person")
 */
class Bear {
 
}

module.exports = Bear;
...

```
 
You need to create person table in test database in MySQL or MariaDB. This controller will access test.person table to handle client's requests. Schema for test.person table is as follows.

```table
id      INT    AUTO_INCREMENT
name    TEXT
age     INT
mobile  TEXT

```

You can test REST API requests using POSTMAN or other test tools. Send the following requests to test if the bear-controller works.

- (1) List : GET http://localhost:8001/bear
- (2) Create : POST http://localhost:8001/bear
             Parameters -> name=john, age=20, mobile=010-1000-1000
- (3) Read : GET http://localhost:8001/bear/1
- (4) Update : PUT http://localhost:8001/bear/1
             Parameters -> name=john, age=20, mobile=010-1000-1000
- (5) Delete : DELETE http://localhost:8001/bear/1

Pagination, order by and search options are supported.
Column names can be sent as request parameters for retrieving only designated columns.

- (1) GET http://localhost:8001/bear?page=1&perPage=10
- (2) GET http://localhost:8001/bear?page=1&perPage=10&search=name&searchValue=john&order=name&orderDirection=asc
- (3) GET http://localhost:8001/bear?columns=id,name


Can you see results same as what you expected?
You can define each methods with REST api support. The following cat-controller has annotation for REST api but no table attribute. Cat class has methods for each REST api instead.

- See `controllers/cat-controller.js` for method definitions with REST api support.

  * controllers/cat-controller.js    annotation for class can be set for REST api support
                                     list, create, read, update, delete methods are automatically configured

```js
// cat-controller.js
...

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

/**
 * @Controller(path="/cat", type="rest")
 */
class Cat {
 
    list(req, res) {
        logger.debug('Cat:list called for path /cat');

        const params = param.parse(req);

        const output = [
            {
                name:'sandy'
            },
            {
                name:'puma'
            }
        ]
        
        util.sendRes(res, 200, 'OK', output);
    }
  
...

```
  
Method names need to be matched with REST API functions : list, create, read, update, delete.
The param module parses request parameters meeting GET, POST or other request methods.
The logger module saves log files in log folder.
The util module has several methods to simplify response handling.

Send the following requests to test if the cat-controller works.

- (1) List : GET http://localhost:8001/cat
- (2) Create : POST http://localhost:8001/cat
             Parameters -> name=sean
- (3) Read : GET http://localhost:8001/cat/1
- (4) Update : PUT http://localhost:8001/cat/1
             Parameters -> name=james
- (5) Delete : DELETE http://localhost:8001/cat/1



You can access database inside the controller. The following lion-controller has database access functions in each method.

- See `controllers/lion-controller.js` for database access in each REST api method.

  * controllers/lion-controller.js    annotation for class can be set for REST api support
                                      database access functions are supported

```js
// lion-controller.js
...

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');
const Database = require('../database/database_mysql');
const sqlConfig = require('../database/sql/lion_sql');

/**
 * @Controller(path="/lion")
 */
class Lion {

    constructor() {
      this.database = new Database('database_mysql');
    }

    /**
     * @RequestMapping(path="/:id", method="get")
     */
    async read(req, res) {
      logger.debug('Lion:read called for path /read/:id');

      const params = param.parse(req);
        
      try {
              
        const queryParams = {
          sqlName: 'lion_read',
          params: params,
          paramType: {}
        }
 
	const rows = await this.database.execute(queryParams);

	util.sendRes(res, 200, 'OK', rows);
      } catch(err) {
	util.sendError(res, 400, 'Error in execute -> ' + err);
      }
    }


...

```
  

Request path in @Controller annotation and the one in @RequestMapping annotation will be joined. @Controller annotation is added on classes and @RequestMapping annotation is added on methods.
You need to create lion table in test database in MySQL or MariaDB. This controller will access test.lion table to handle client's requests. Schema for test.lion table is as follows.

```table
id      INT    AUTO_INCREMENT
name    TEXT
age     INT
mobile  TEXT

```

This read method uses lion_read sql statement defined in database/sql/lion_sql.sql file. The SQL statement is as follows.

```sql
    lion_read: {
        sql: "select \
                id, \
                name, \
                mobile \
            from test.lion \
            where id = :id"
    }

```

The :id parameter means id request parameter sent by clients.
Send the following requests to test if the lion-controller works.

- (1) List : GET http://localhost:8001/lion
- (2) Create : POST http://localhost:8001/lion
             Parameters -> name=sean, mobile=010-1000-1000
- (3) Read : GET http://localhost:8001/lion/1
- (4) Update : PUT http://localhost:8001/lion/1
             Parameters -> name=james, mobile=010-2000-2000
- (5) Delete : DELETE http://localhost:8001/lion/1


You can add annotation only on methods in the controller class. Tiger class shows how to add annotation @RequestMapping only on methods.

- See `controllers/tiger-controller.js` for @RequestMapping annotation

```js
// tiger-controller.js
...

const util = require('../util/util');
const param = require('../util/param');
const logger = require('../util/logger');

class Tiger {

    /**
     * @RequestMapping(path="/tiger/hello")
     */
    hello(req, res) {
        logger.debug('Tiger:hello called for path /tiger/hello');

        const params = param.parse(req);
        
        const output = {
            message: 'hello'
        }
        
        util.sendRes(res, 200, 'OK', output);
    }

}

module.exports = Tiger;
```

If you restart your server, this controller's hello method is scanned and loaded automatically.
Request path is /tiger/hello and you can send a request using the following URL:

  * http://localhost:8001/tiger/hello

@RequestMapping annotation can have the following attributes.

  * path : Request path
  * method : Request method such as get, post
             Default value is 'get,post' and it means GET and POST methods are set.
	    
@Controller annotation can be set for class level configuration for setting base URI
Examples for @Controller annotation are as follows:

  * controllers/dog-controller.js    annotation for class can be set for base URI of request path
  
```js
// dog-controller.js
...

/**
 * @Controller(path="/dog")
 */
class Dog {

    /**
     * @RequestMapping(path="/list")
     */
    list(req, res) {
        logger.debug('Dog:list called for path /dog/list');

...

```
  
Controller definition is flexible and you can define your own controllers to meet your client's requests.  
  
- Warning : If you use `npm rm`, `npm build-norm`, `npm start-norm` command, this project uses babel for ES6 support. It means all source files are transpiled and moved into dist folder. However, annotation can only be used for ES6 classes and methods. Therefore, you should maintain ES6 source files in deploying to clould server.



## Classic Controller

If you create a controller of classic style, it needs to be registered in the config/controller-config.js file. In case you define a controller according to the REST standards, only unit name is needed to register in the configuration file. Unit name is used to find the controller file you created.

- See `controllers/person-controller.js` for REST type controller
- See `controllers/profile-controller.js` for API type controller
- See `controllers/test-controller.js` for cookie and session test


## Configuration for Classic Controller

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

SQL file is separated in the database/sql/person_sql.js file. 

Here is an example :

```js
// person_sql.js

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


## SocketIO and Redis

SocketIO messaging will be enabled if you add socketio attribute in config/config.js file.


```js
// config.js
...

    socketio: {
        active: true
    }
    
}

...

```

or,

```js
// config.js
...

    socketio: {
        active: true,
        pingInterval: 10000,
        pingTimeout: 5000,
        transports: [
	    'websocket'
	]
    }
    
}

...

```

You can create controller files for SocketIO and put them into socketio folder.
See socketio/chat.js file to get how to add methods to handle SocketIO chatting.
Sample codes are in public folder. See the following files.

  * public/chat.html
  * public/chat2.html
  * public/chat3.html

Redis is used for SocketIO and you can make SocketIO connect to redis server.
Redis is needed to be installed before enabled.
You can add redis attribute to config/config.js after installing redis.

```js
// config.js
...

    redis: {
        failover: false,
        host:'127.0.0.1', 
        port: 10425,
        name: 'mymaster'
    }

...
```


Failover functions for Redis is basically supported.
You need to configure redis sentinels before you make redis failover enabled.
Redis sentinels can be configured as follows.
    (Redis is used only for SocketIO messaging if you do not use it for other purposes)
    If you have no idea on Redis sentinels, see [guides here](https://redis.io/topics/sentinel) 
  
```js
// config.js
...

    redis: {
        failover: true,
        sentinels: [
            { host:'127.0.0.1', port: 11425 },
            { host:'127.0.0.1', port: 11426 },
            { host:'127.0.0.1', port: 11427 }
        ],
        name: 'mymaster'
    },

...
```

Test urls for chatting are as follows.

  * 1 to 1 chatting based on Socket.IO : http://localhost:8001/chat.html
  * Video chatting based on Socket.IO and WebRTC : http://localhost:8001/chat2.html
  * Advanced video chatting : http://localhost:8001/chat3.html


## MD Bootstrap

If you use md-bootstrap library for pages in public folder, please put mdb folder in the public folder. 'mdb' folder means the one you can download from mdbootstrap.com site. You can extract zip file after downloading the library and change the name of the folder into 'mdb'.


## FCM Push

This server supports FCM(Firebase Cloud Messaging) push to send push messages to Android, iOS devices.
You need to add gcm_api_key attribute to config/config.js file if you want to make push functions enabled.

- Warning : FCM Push is supported only in Enterprise version of Ubiaccess server.
  Please send me an request e-mail to evaluate enterprise version of Ubiaccess server.



## API documentation

API documentation using swagger is applied. You can access documentation for controllers as the following:

- See http://localhost:8001/api-docs


## License
MIT © Mike Jung
