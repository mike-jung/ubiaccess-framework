'use strict'
const Annotation = require('../annotation')

module.exports = class MyConstructor extends Annotation {
  /**
   * Annotation to parse
   *
   * @type {*}
   */
  static get targets() {
    return [Annotation.CONSTRUCTOR]
  }

}
