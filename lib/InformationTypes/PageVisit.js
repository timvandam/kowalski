module.exports = Information => class extends Information {
  static get name () {
    return 'Kowalski:PageView'
  }

  constructor (req) {
    super()
    this.method = req.method
    this.path = req.path
  }

  getInformation () {
    return {
      method: this.method,
      path: this.path
    }
  }
}
