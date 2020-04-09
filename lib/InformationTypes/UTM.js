module.exports = Information => class extends Information {
  constructor (req) {
    super('Kowalski:UTM')
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

    this.source = source
    this.medium = medium
    this.campaign = campaign
    this.term = term
    this.content = content
    this.method = req.method
    this.path = req.path
  }

  getInformation () {
    return {
      source: this.source,
      medium: this.medium,
      term: this.term,
      content: this.content,
      campaign: this.campaign
    }
  }
}
