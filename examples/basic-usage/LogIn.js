const Kowalski = require('kowalski-analytics')

class LogIn extends Kowalski.Information {
  // We don't want Kowalski to attempt to collect this metric on every request
  // as we will manually let Kowalski know to collect this metric after a succesful login
  static get eachReq () {
    return false
  }

  // We will provide a username whenever collecting this metric
  constructor (username) {
    super()
    if (!username) return Kowalski.Information.NoInformation
    this.username = username
  }

  get data () {
    return { username: this.username }
  }

  static fromObject ({ username }) {
    return new LogIn(username)
  }
}

module.exports = LogIn
