const { Readable, Writable } = require('stream')

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
   * An object of Kowalski options
   * @typedef {Object} Options
   * @property {InformationGenerator[]} informationToCollect - list of InformationGenerators
   * @property {Writable[]} storages - writable streams that receive Information emitted by Kowalski
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

    this.informationTypes = new Map()

    // Check provided arguments
    if (!Array.isArray(storages)) throw new InvalidArgumentException('Storages must be an array!')
    if (!Array.isArray(informationToCollect)) throw new InvalidArgumentException('InformationToCollect must be an array!')

    // Pipe this Kowalski information to storage streams if they're valid
    storages.forEach((storage, index) => {
      if (!(storage instanceof Writable)) throw new InvalidArgumentException(`storages[${index}] must be a writable stream!`)
      if (!storage.writableObjectMode) throw new InvalidArgumentException(`storages[${index}] must be in object mode!`)
      this.pipe(storage)
    })

    // Save informationTypes if they're valid
    informationToCollect.forEach((InformationGenerator, index) => {
      if (typeof InformationGenerator !== 'function') throw new InvalidArgumentException(`informationToCollect[${index}] must be a function!`)
      const info = InformationGenerator(Kowalski.Information)
      if (!(info.prototype instanceof Kowalski.Information)) throw new InvalidArgumentException(`informationToCollect[${index}] must extend Kowalski.Information!`)
      if (info.prototype.getInformation === Kowalski.Information.prototype.getInformation) throw new InvalidArgumentException(`informationToCollect[${index}] must have getInformation defined!`)
      if (!info.name) throw new InvalidArgumentException(`informationToCollect[${index}] must have name defined!`)
      if (this.informationTypes.has(info.name)) throw new InvalidArgumentException(`informationToCollect[${index}] has a duplicate name!`)
      this.informationTypes.set(info.name, info)
    })

    // Instead of returning this instance, return the middleware
    return this.kowalski.bind(this)
  }

  /**
   * Triggers an Information collection
   * @param {String} name - the name of the Information to collect
   * @param {Express.Request} req - express request object
   * @returns {Boolean} whether data was succesfully read
   * @todo don't use this.push when not needed
   */
  triggerEvent (name, req) {
    if (!this.informationTypes.has(name)) throw new InvalidArgumentException(`Information type'${name}' does not exist`)
    const Information = this.informationTypes.get(name)
    const data = new Information(req)
    if (!(data instanceof Kowalski.Information)) return false
    this.push(data)
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
    for (const informationName of this.informationTypes.keys()) this.triggerEvent(informationName, req)
    next()
  }

  /**
   * @todo implement this
   */
  _read () {
  }
}

Kowalski.Information = require('./Information')

module.exports = Kowalski
