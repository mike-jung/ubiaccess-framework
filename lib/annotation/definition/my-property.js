'use strict'
const Annotation = require('../annotation')

module.exports = class MyProperty extends Annotation {
  static get targets() {
    return [Annotation.PROPERTY]
  }
}
