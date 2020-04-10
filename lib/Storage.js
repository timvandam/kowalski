const { Writable } = require('stream')

const { NotImplementedException } = require('ezerrors')

const abstractError = new NotImplementedException('Information is an abstract class, all methods must be implemented')

/**
 * Abstract class that stores Information
 * @abstract
 */
class Storage extends Writable {
  /**
   * Creates a Storage instance
   * @abstract
   */
  constructor () {
    super({ objectMode: true })
  }

  // TODO: methods for fetching data

  /**
   * Fetches some data from the storage
   * @abstract
   * @param {String} name - name of the information to collect
   * @param {Date} startDate - the start date of the information to collect
   * @param {Date} endDate - the end date of the information to collect
   */
  getInformation (name, startDate, endDate) {
    throw abstractError
  }
}

module.exports = Storage
