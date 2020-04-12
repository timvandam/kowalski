const { NotImplementedException } = require('ezerrors')

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
   * Whether this Information should be collected on every request
   * Defaults to true
   */
  static get eachReq () {
    return true
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
    throw new NotImplementedException('Abstract static name was not set!')
  }

  _getInformation () {
    throw new NotImplementedException('Abstract _getInformation was not implemented!')
  }

  /**
   * Returns Information to be read by storages
   * @returns {Object} an object of Information to be read by storages
   */
  getInformation () {
    return {
      date: this.date,
      ...this._getInformation()
    }
  }

  /**
   * Serializes the provided array of Information objects into an array of useful information
   * @abstract
   * @param {Information[]} information - a list of Information
   * @returns {Statistic[]} an array of objects containing useful data
   */
  static serializeInformation (information) {
    throw new NotImplementedException('Abstract static serializeInformation was not implemented!')
  }
}

module.exports = Information
