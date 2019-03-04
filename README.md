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
     

## Installation / Usage

  1. RUN `npm install` to install external modules.
  2. RUN `npm start` to start the server.


## Auto-loading

There is a fair amount of auto-loading built into this application structure.

  * Registered controllers in config/controller-config file will be autoloaded.
  * Registered services in config/service-config file will be autoloaded.
      if you defined list method in a service, doList method will be automatically added as a Promise object
  * Registered SQL statements in config/sql-config file will be autoloaded.
  
 
## Sample Controller

See `controllers/person-controller.js` for REST type controller
See `controllers/profile-controller.js` for API type controller
See `controllers/test-controller.js` for cookie and session test


## Sample Service

See `services/person-service.js`


## Sample Model

See `models/person.js`
