const Kowalski = require('kowalski-analytics')

// Define a metric that Kowalski can collect
class PageVisit extends Kowalski.Information {
  // Make Kowalski collect this metric on every request
  // By default Kowalski.Information sets eachReq to true
  static get eachReq () {
    return true
  }

  // The constructor reads the provided object to generate meaningful data.
  // Since PageVisit.eachReq is true, Kowalski will always send an Express.Request object
  constructor (req) {
    super()
    // We only want to collect PageVisits of logged in users
    // To indicate that we don't want to collect data for this request we return NoInformation
    if (!req.user) return Kowalski.Information.NoInformation
    this.path = req.path
  }

  // Define what data should be stored by the storage
  get data () {
    return {
      path: this.path
    }
  }

  // Define how an object returned by this.data can be converted back to a PageVisit instance
  static fromObject ({ path }) {
    return Object.assign(Object.create(PageVisit.prototype), { path })
  }
}

module.exports = PageVisit
