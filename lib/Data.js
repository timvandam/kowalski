const { NotImplementedException } = require('ezerrors')

const abstractError = new NotImplementedException('Data is an abstract class, all methods must be implemented')

/**
 * Abstract class that reads Express.Request objects to generate Data instances
 * @abstract
 */
class Data {
  /**
   * Reads an Express.Request object and creates a Data object
   * @param {Express.Request} req - express request object
   * @returns {undefined|Data.NoData} returns nothing when data was read, returns {} when data could not be read
   */
  // eslint-disable-next-line
  constructor () {}

  /**
   * An empty object. Used to tell Kowalski that no data could be read
   */
  static get NoData () {
    return {}
  }

  /**
   * Returns data to be read by storages
   * @abstract
   * @returns {Object} an object of data to be read by storages
   */
  getData () {
    throw abstractError
  }
}

module.exports = Data
