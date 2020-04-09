module.exports = Information => class extends Information {
  constructor (req) {
    super('Kowalski:PageVisit')
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
