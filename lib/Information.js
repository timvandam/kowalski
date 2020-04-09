const { NotImplementedException } = require('ezerrors')

const abstractError = new NotImplementedException('Information is an abstract class, all methods must be implemented')

/**
 * Abstract class that reads Express.Request objects to generate Information instances. It should not be constructed directly
 * @abstract
 */
class Information {
  /**
   * Creates an Information instance
   * @param {String} name - the name of this type of Information
   * @todo think of more default values Information should include
   */
  constructor (name) {
    this.name = name
    this.date = new Date()
  }

  /**
   * An empty object. Used to tell Kowalski that no Information could be read
   */
  static get NoInformation () {
    return {}
  }

  /**
   * Returns Information to be read by storages
   * @abstract
   * @returns {Object} an object of Information to be read by storages
   */
  getInformation () {
    throw abstractError
  }
}

Information.PageVisit = require('./InformationTypes/PageVisit')

module.exports = Information
