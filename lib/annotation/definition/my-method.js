'use strict'
const Annotation = require('../annotation')

module.exports = class RequestMapping extends Annotation {
  /**
   * The target types
   *
   * @type {Array}
   */
  static get targets() {
    return [Annotation.METHOD]
  }
}
