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

  /**
   * Returns data collected by the Information instance
   * @abstract
   * @returns {Object} object of collected data
   */
  get data () {
    throw new NotImplementedException('Abstract data was not set!')
  }

  /**
   * Returns Information to be read by storages
   * @returns {Object} an object of Information to be read by storages
   */
  getData () {
    return {
      date: this.date,
      ...this.data
    }
  }

  /**
   * Creates an instance from an object (e.g. provided by the storage)
   * @abstract
   * @param {Object} obj - object to use
   */
  fromObject (obj) {
    throw new NotImplementedException('Abstract fromObject was not implemented!')
  }
}

module.exports = Information
