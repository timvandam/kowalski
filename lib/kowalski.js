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

    this.informationTypes = new Set()

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
      if (!(info.prototype.getInformation !== Kowalski.Information.prototype.getInformation)) throw new InvalidArgumentException(`informationToCollect[${index}] must have getInformation defined!`)
      this.informationTypes.add(info)
    })

    // Instead of returning this instance, return the middleware
    return this.kowalski.bind(this)
  }

  /**
   * Kowalski middleware
   * @param {Express.Request} req - express request object
   * @param {Express.Response} res - express response object
   * @param {Function} next - express next method
   */
  kowalski (req, res, next) {
    for (const Information of this.informationTypes) {
      // Read Express.Request
      const data = new Information(req)
      // If no Information was read, head to the next Information type
      if (!(data instanceof Kowalski.Information)) continue
      // Send read Information to all storages
      this.push(data)
    }
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
