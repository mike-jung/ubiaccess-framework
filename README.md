# node-web-starter

This is a boilerplate project for MVC architecture using node, express and MySQL (or MariaDB)

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


## Auto-loading

There is a fair amount of auto-loading built into this application structure.

  * Registered controllers in config/controller-config file will be autoloaded.
  * Registered services in config/service-config file will be autoloaded.
      if you defined list method in a service, doList method will be automatically added as a Promise object
  * Registered SQL statements in config/sql-config file will be autoloaded.
  
  
## ES2015

This boilerplate uses ES6 syntax with Node.js 10.0, you can check out the [feature available here](https://nodejs.org/en/docs/es6/)


### Configuration

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

Promise objects for REST methods are added automatically. If you defined list method in a service, doList method will be automatically added as a Promise object.

If the type attribute is set to 'path', the method is loaded using path, method, file and func attributes.

  * path - request path
  * method - request method ('GET', 'POST', 'PUT', etc. Multiple methods can be used)
  * file - controller file created
  * func - function in the controller file used for callback method


## Sample Controller

- See `controllers/person-controller.js` for REST type controller
- See `controllers/profile-controller.js` for API type controller
- See `controllers/test-controller.js` for cookie and session test


## Sample Service

- See `services/person-service.js`


## Sample Model

- See `models/person.js`
