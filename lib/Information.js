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
   * @todo inject default values into children's getInformation
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
   * @abstract
   * @returns {Object} an object of Information to be read by storages
   */
  getInformation () {
    throw abstractError
  }
}

// TODO: Move these to their own packages
Information.PageVisit = require('./InformationTypes/PageVisit')
Information.UTM = require('./InformationTypes/UTM')

module.exports = Information
