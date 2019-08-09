'use strict'
const Annotation = require('../annotation')

module.exports = class Controller extends Annotation {

  /**
   * The target types
   *
   * @type {Array}
   */
  static get targets() {
    return [Annotation.DEFINITION]
  }

}
