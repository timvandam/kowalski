const Kowalski = require('../../../')

module.exports = class extends Kowalski.Information {
  static get name () {
    return 'Kowalski:PageVisit'
  }

  constructor (req) {
    super()
    this.method = req.method
    this.path = req.path
  }

  get _data () {
    return {
      method: this.method,
      path: this.path
    }
  }

  static fromObject ({ method, path }) {
    return Object.assign(Object.create(this.prototype), { method, path })
  }
}
