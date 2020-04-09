const { Readable, Writable } = require('stream')

const { InvalidArgumentException } = require('ezerrors')

/**
 * Kowalski, analysis!
 * Kowalski brings web analytics to Express
 * @extends Readable
 */
class Kowalski extends Readable {
  /**
   * @typedef {Function} DataGenerator
   * @param {Data} - Data class that the returned class must extend
   * @returns {Data} class that reads Express.Request objects to generate data
   */

  /**
   * @typedef {Object} Options
   * @property {DataGenerator[]} dataToCollect - list of data to collect
   * @property {Storage[]} storages - storages (writable streams) that store data emitted by Kowalski
   */

  /**
   * Creates a fresh Kowalski instance and returns the middleware function
   * @param {Options} [options] - options to provide kowalski
   */
  constructor ({
    storages = [],
    dataToCollect = []
  } = {}) {
    super({ objectMode: true })

    // Check provided arguments
    if (!Array.isArray(storages)) throw new InvalidArgumentException('Storages must be an array!')
    if (!Array.isArray(dataToCollect)) throw new InvalidArgumentException('DataToCollect must be an array!')

    // Check storages
    const invalidStorages = []
    storages.forEach((storage, index) => {
      const valid = storage instanceof Writable
      if (valid) return
      invalidStorages.push(index)
    })
    if (invalidStorages.length) throw new InvalidArgumentException(`Invalid Storage at index ${invalidStorages.join(',')}`)

    // Check dataToCollect
    const invalidDataTypes = []
    dataToCollect.forEach((dataType, index) => {
      const valid = typeof dataType === 'function' && dataType() instanceof Kowalski.Data
      if (valid) return
      invalidDataTypes.push(index)
    })
    if (invalidDataTypes.length) throw new InvalidArgumentException(`Invalid DataType at index ${invalidDataTypes.join(',')}`)

    // Pipe all data emitted by kowalski to storages
    for (const storage of storages) this.pipe(storage)

    // Save datatypes
    this.dataTypes = new Set()
    for (const dataType of dataToCollect) this.dataTypes.add(dataType())

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
    for (const DataType of this.dataTypes) {
      // Read Express.Request
      const data = new DataType(req)
      // If no data was read, head to the next DataType
      if (!(data instanceof Kowalski.Data)) continue
      // Send read data to all storages
      for (const storage of this.storages) storage.write(data)
    }
    next()
  }
}

Kowalski.Data = require('./Data')

/**
 * Creates a Kowalski instance
 * @returns {Kowalski} express Kowalski middleware
 */
module.exports = function kowalski (...args) {
  return new Kowalski(...args)
}
