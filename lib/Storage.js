const { Writable } = require('stream')

const { NotImplementedException } = require('ezerrors')

/**
 * Abstract class that stores Information
 * @abstract
 */
class Storage extends Writable {
  /**
   * Creates a Storage instance
   */
  constructor () {
    super({ objectMode: true })
  }

  // TODO: methods for fetching data
  /**
   * Fetches some data from the storage
   * @abstract
   * @param {Information} Information - Information class to collect information for
   * @param {Date} start - the start date of the information to collect
   * @param {Date} end - the end date of the information to collect
   * @returns {Information[]} all matching Information
   */
  _getInformation (Information, start, end) {
    throw new NotImplementedException('getInformation is not implemented!')
  }

  /**
   * Fetches serialized data from teh database
   * @param {String} name - name of the information to collect
   * @param {Date} [start=new Date(0)] - the start date of the information to collect
   * @param {Date} [end=new Date())] - the end date of the information to collect
   * @returns {Object[]} serialized Information
   */
  async getInformation (name, start = new Date(0), end = new Date()) {
    const Information = this.informationTypes.get(name.toLowerCase())
    if (!Information) return []
    const info = await this._getInformation(Information, start, end)
    if (!info.length) return []
    return Information.serializeInformation(info)
  }
}

module.exports = Storage
