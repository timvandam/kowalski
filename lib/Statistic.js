const { InvalidArgumentException } = require('ezerrors')

/**
 * Class that stores named statistics
 */
class Statistic {
  /**
   * Constructs a Statistic instance
   * @param {String} name - the name of this Statistic
   * @param {Object.<String, String>} data - object with relevant information
   */
  constructor (name, data = {}) {
    if (typeof name !== 'string') throw new InvalidArgumentException('Name must be a string!')
    if (!name) throw new InvalidArgumentException('You must provide a name!')
    if (!data) throw new InvalidArgumentException('You must provide data!')
    this.name = name
    this.data = data
    for (const key in this.data) this.data[key] = this.data[key].toString()
  }
}

module.exports = Statistic
