const { NotImplementedException } = require('ezerrors')

const abstractError = new NotImplementedException('Information is an abstract class, all methods must be implemented')

/**
 * Abstract class that reads Express.Request objects to generate Information instances. It should not be constructed directly
 * @abstract
 */
class Information {
  /**
   * Creates an Information instance
   * @todo think of more default values Information should include
   */
  constructor () {
    this.date = new Date()
  }

  /**
   * An empty object. Used to tell Kowalski that no Information could be read
   */
  static get NoInformation () {
    return {}
  }

  /**
   * The name of this Information
   * @abstract
   */
  static get name () {
    throw abstractError
  }

  /**
   * Returns Information to be read by storages
   * @returns {Object} an object of Information to be read by storages
   */
  getInformation () {
    return {
      ...this._getInformation(),
      date: this.date
    }
  }

  /**
   * Serializes the provided array of Information objects into an array of useful information
   * @abstract
   * @param {Information[]} information - a list of Information
   * @returns {Object[]} an array of objects containing useful data
   */
  static serializeInformation (information) {
    throw abstractError
  }
}

module.exports = Information
