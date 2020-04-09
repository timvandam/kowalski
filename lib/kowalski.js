const { Readable } = require('stream')

// TODO: Class that is some recorded thing (Kowalski.Data)
// all analytics extend this class

/**
 * Kowalski, analysis!
 * Kowalski brings web analytics to Express
 * @extends Readable
 */
class Kowalski extends Readable {
  /**
   * @typedef {Object} Options
   * @property {Data[]} analytics - data that should be analyzed
   * @property {Storage[]} storages - storages (writable streams) that store data emitted by Kowalski
   */

  /**
   * Creates a fresh kowalski instance and returns the middleware function
   * @param {Options} [options] - options to provide kowalski
   */
  constructor (options = {}) {
    super({ objectMode: true })
    return this.kowalski.bind(this)
  }

  /**
   * Kowalski middleware
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {Function} next
   */
  kowalski (req, res, next) {
    // TODO: Deep copy req before passing it to data collectors
    // TODO: loop through this.analytics. const data = Analytic.fromReq(req)
    // returns null -> continue
    // returns Data, this.push
  }
}

function kowalski (...args) {
  return new Kowalski(...args)
}

new Kowalski()()

module.exports = kowalski
