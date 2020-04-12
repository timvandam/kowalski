const { Writable } = require('stream')

/**
 * Abstract class that stores Information
 * @abstract
 * @todo uniform way of retrieving data from the storage
 */
class Storage extends Writable {
  /**
   * Creates a Storage instance
   * @param {Map.<String, Information>} informationTypes - map that maps lowercase information name to Information class
   */
  constructor (informationTypes) {
    super({ objectMode: true })
    this.informationTypes = informationTypes
  }
}

module.exports = Storage
