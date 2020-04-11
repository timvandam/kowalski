const { Writable } = require('stream')

const Kowalski = require('./Kowalski')
const { NotImplementedException, InvalidReturnValueException } = require('ezerrors')

/**
 * Abstract class that stores Information
 * @abstract
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

  /**
   * Fetches some data from the storage
   * @abstract
   * @param {Information} Information - Information class to collect information for
   * @param {Date} start - the start date of the information to collect
   * @param {Date} end - the end date of the information to collect
   * @returns {Information[]} all matching Information
   */
  _getInformation (Information, start, end) {
    throw new NotImplementedException('Abstract getInformation was not implemented!')
  }

  /**
   * Fetches serialized data from teh database
   * @param {String} name - name of the information to collect
   * @param {Date} [start=new Date(0)] - the start date of the information to collect
   * @param {Date} [end=new Date())] - the end date of the information to collect
   * @returns {Statistic[]} serialized Information
   */
  async getInformation (name, start = new Date(0), end = new Date()) {
    const Information = this.informationTypes.get(name.toLowerCase())
    if (!Information) return []
    const info = await this._getInformation(Information, start, end)
    if (!info.length) return []
    const statistics = Information.serializeInformation(info)
    if (statistics.some(stat => !(stat instanceof Kowalski.Statistic))) throw new InvalidReturnValueException(`${Information.name}.serializeInformation must return a list of Kowalski.Statistic instances!`)
    return statistics
  }
}

module.exports = Storage
