var Classes = Object.create(null);

exports.createPool = function createPool(config) {
  var Pool       = loadClass('Pool');
  var PoolConfig = loadClass('PoolConfig');

  return new Pool({config: new PoolConfig(config)});
};

function loadClass(className) {
  var Class = Classes[className];

  if (Class !== undefined) {
    return Class;
  }

  // This uses a switch for static require analysis
  switch (className) {
    case 'Connection':
      Class = require('./Connection');
      break;
    case 'ConnectionConfig':
      Class = require('./ConnectionConfig');
      break;
    case 'Pool':
      Class = require('./Pool');
      break;
    case 'PoolCluster':
      Class = require('./PoolCluster');
      break;
    case 'PoolConfig':
      Class = require('./PoolConfig');
      break;
    default:
      throw new Error('Cannot find class \'' + className + '\'');
  }

  // Store to prevent invoking require()
  Classes[className] = Class;

  return Class;
}

