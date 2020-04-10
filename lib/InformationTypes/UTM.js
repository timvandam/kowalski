module.exports = Information => class extends Information {
  static get name () {
    return 'Kowalski:UTM'
  }

  constructor (req) {
    super()
    const {
      utm_source: source,
      utm_medium: medium,
      utm_campaign: campaign,
      utm_term: term,
      utm_content: content
    } = req.query

    if (!source) return Information.NoInformation
    if (!medium) return Information.NoInformation
    if (!campaign) return Information.NoInformation
    if (req.method !== 'GET') return Information.NoInformation

    this.source = source
    this.medium = medium
    this.campaign = campaign
    this.term = term
    this.content = content
    this.path = req.path
  }

  _getInformation () {
    return {
      source: this.source,
      medium: this.medium,
      term: this.term,
      content: this.content,
      campaign: this.campaign,
      path: this.path
    }
  }
}
