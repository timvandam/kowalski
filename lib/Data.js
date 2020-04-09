const { NotImplementedException } = require('ezerrors')

const abstractError = new NotImplementedException('Data is an abstract class, all methods must be implemented')

/**
 * Abstract class that reads Express.Request objects to generate Data instances
 * @abstract
 */
class Data {
  /**
   * Reads an Express.Request object and creates a Data object
   * @abstract
   * @param {Express.Request} req - express request object
   * @returns {undefined|{}} returns nothing when data was read, returns {} when data could not be read
   */
  constructor (req) {
    throw abstractError
  }

  /**
   * Returns data to be read by storages
   * @abstract
   * @returns {Object} an object of data
   */
  getData () {
    throw abstractError
  }
}

module.exports = Data
