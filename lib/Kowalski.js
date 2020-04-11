const { Readable } = require('stream')

const { InvalidArgumentException } = require('ezerrors')

/**
 * Kowalski, analysis!
 * Kowalski brings web analytics to Express
 * @extends Readable
 */
class Kowalski extends Readable {
  /**
   * Function that generates a class that extends Information
   * @typedef {Function} InformationGenerator
   * @param {Information} - Information class that the returned class must extend
   * @returns {Information} class that reads Express.Request objects to generate Information
   */

  /**
   * @typedef {Function} StorageGenerator
   * @param {Storage} - Storage class that the returned class must extend
   * @returns {Storage} writable stream that writes into the db
   */

  /**
   * An object of Kowalski options
   * @typedef {Object} Options
   * @property {InformationGenerator[]} informationToCollect - list of InformationGenerators
   * @property {StorageGenerator[]} storages - writable streams that receive Information emitted by Kowalski
   */

  /**
   * Creates a fresh Kowalski instance and returns the middleware function
   * @param {Options} [options] - options to provide Kowalski
   */
  constructor ({
    storages = [],
    informationToCollect = []
  } = {}) {
    super({ objectMode: true })
    this.reading = false // whether we should be pushing data
    this.infoBuffer = [] // saves information when not pushing

    this.informationTypes = new Map()

    // Check provided arguments
    if (!Array.isArray(informationToCollect)) throw new InvalidArgumentException('InformationToCollect must be an array!')
    if (!Array.isArray(storages)) throw new InvalidArgumentException('Storages must be an array!')

    // Save informationTypes if they're valid
    informationToCollect.forEach((InformationGenerator, index) => {
      if (typeof InformationGenerator !== 'function') throw new InvalidArgumentException(`informationToCollect[${index}] must be a function!`)
      const Information = InformationGenerator(Kowalski.Information)
      if (!(Information.prototype instanceof Kowalski.Information)) throw new InvalidArgumentException(`informationToCollect[${index}] must extend Kowalski.Information!`)
      if (!Information.prototype._getInformation) throw new InvalidArgumentException(`informationToCollect[${index}] must have getInformation defined!`)
      if (Information.serializeInformation === Kowalski.Information.serializeInformation) throw new InvalidArgumentException(`informationToCollect[${index}] must have static serializeInformation defined!`)
      if (!Information.name) throw new InvalidArgumentException(`informationToCollect[${index}] must have name defined!`)
      if (this.informationTypes.has(Information.name.toLowerCase())) throw new InvalidArgumentException(`informationToCollect[${index}] has a duplicate name!`)
      this.informationTypes.set(Information.name.toLowerCase(), Information)
    })

    // Pipe this Kowalski information to storage streams if they're valid
    storages.forEach((StorageGenerator, index) => {
      if (typeof StorageGenerator !== 'function') throw new InvalidArgumentException(`storages[${index}] must be a function!`)
      const Storage = StorageGenerator(Kowalski.Storage)
      if (!(Storage.prototype instanceof Kowalski.Storage)) throw new InvalidArgumentException(`storages[${index}] must extend Kowalski.Storage!`)
      const storage = new Storage(Array.from(this.informationTypes.values()))
      this.pipe(storage)
      storage.informationTypes = this.informationTypes
    })

    // Instead of returning this instance, return the middleware
    return this.kowalski.bind(this)
  }

  /**
   * Triggers an Information collection
   * @param {String} name - the name of the Information to collect
   * @param {Express.Request} req - express request object
   * @returns {Boolean} whether data was succesfully read
   */
  triggerInfoCollect (name, req) {
    name = name.toLowerCase()
    if (!this.informationTypes.has(name)) throw new InvalidArgumentException(`Information type '${name}' does not exist`)
    const Information = this.informationTypes.get(name)
    const data = new Information(req)
    if (!(data instanceof Kowalski.Information)) return false
    if (this.reading) this.reading = this.push(data) // if reading stream the data
    else this.infoBuffer.push(data) // else save it in the buffer
    return true
  }

  /**
   * Kowalski middleware
   * @param {Express.Request} req - express request object
   * @param {Express.Response} res - express response object
   * @param {Function} next - express next method
   */
  kowalski (req, res, next) {
    // Make kowalski accesible by the request
    req.kowalski = this
    // Trigger all events
    for (const informationName of this.informationTypes.keys()) this.triggerInfoCollect(informationName, req)
    next()
  }

  /**
   * Used by Readable for data streaming
   */
  _read () {
    // First empty the buffer
    this.reading = true
    while (this.reading && this.infoBuffer.length) {
      this.reading = this.push(this.infoBuffer.shift())
      if (!this.reading) return
    }
    // Now the middleware will push live data
  }
}

Kowalski.Information = require('./Information')
Kowalski.Storage = require('./Storage')

module.exports = Kowalski
