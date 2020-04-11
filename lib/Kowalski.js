const { Readable } = require('stream')

const { InvalidArgumentException } = require('ezerrors')

/**
 * Kowalski, analysis!
 * Kowalski brings web analytics to Express
 * @extends Readable
 */
class Kowalski extends Readable {
  /**
   * An object of Kowalski options
   * @typedef {Object} Options
   * @property {Information[]} informationToCollect - list of Information classes
   * @property {Storage} storage - writable stream that receives Information emitted by Kowalski
   */

  /**
   * Creates a fresh Kowalski instance and returns the middleware function
   * @param {Options} [options] - options to provide Kowalski
   */
  constructor ({
    storage: Storage,
    informationToCollect = []
  } = {}) {
    super({ objectMode: true })
    this.reading = false // whether we should be pushing data
    this.infoBuffer = [] // saves information when not pushing

    this.informationTypes = new Map()

    if (!Array.isArray(informationToCollect)) throw new InvalidArgumentException('InformationToCollect must be an array!')
    if (!(Storage.prototype instanceof Kowalski.Storage)) throw new InvalidArgumentException('Storage must extend Kowalski.Storage!')

    // Save informationTypes if they're valid
    informationToCollect.forEach((Information, index) => {
      if (!(Information.prototype instanceof Kowalski.Information)) throw new InvalidArgumentException(`informationToCollect[${index}] must extend Kowalski.Information!`)
      if (!Information.prototype._getInformation) throw new InvalidArgumentException(`informationToCollect[${index}] must have getInformation defined!`)
      if (Information.serializeInformation === Kowalski.Information.serializeInformation) throw new InvalidArgumentException(`informationToCollect[${index}] must have static serializeInformation defined!`)
      if (!Information.name) throw new InvalidArgumentException(`informationToCollect[${index}] must have name defined!`)
      if (this.informationTypes.has(Information.name.toLowerCase())) throw new InvalidArgumentException(`informationToCollect[${index}] has a duplicate name!`)
      this.informationTypes.set(Information.name.toLowerCase(), Information)
    })

    // Pipe this Kowalski information to the storage stream if it's valid
    const storage = new Storage(Array.from(this.informationTypes.values()))
    // TODO: Don't pass this here somehow
    storage.informationTypes = this.informationTypes
    this.storage = storage
    this.pipe(storage)

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
