module.exports = Information => class extends Information {
  static get name () {
    return 'Kowalski:PageVisit'
  }

  constructor (req) {
    super()
    this.method = req.method
    this.path = req.path
  }

  _getInformation () {
    return {
      method: this.method,
      path: this.path
    }
  }

  static serializeInformation (information) {
    // TODO: Return an array of Statistic class instances instead (should be provided as parameter)
    const serialized = {}
    information.forEach(info => {
      const { path } = info
      if (!serialized[path]) serialized[path] = 0
      serialized[path]++
    })
    return [serialized]
  }
}
