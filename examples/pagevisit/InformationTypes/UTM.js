const Kowalski = require('../../..')

module.exports = class extends Kowalski.Information {
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

    if (!source) return Kowalski.Information.NoInformation
    if (!medium) return Kowalski.Information.NoInformation
    if (!campaign) return Kowalski.Information.NoInformation
    if (req.method !== 'GET') return Kowalski.Information.NoInformation

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

  static serializeInformation (information) {
    const countPerSource = {}
    const countPerCampaign = {}
    const countPerPath = {}
    information.forEach(info => {
      if (!countPerSource[info.source]) countPerSource[info.source] = 0
      countPerSource[info.source]++
      if (!countPerCampaign[info.campaign]) countPerCampaign[info.campaign] = 0
      countPerCampaign[info.campaign]++
      if (!countPerPath[info.path]) countPerPath[info.path] = 0
      countPerPath[info.path]++
    })
    return [
      new Kowalski.Statistic('Visitors per source', countPerSource),
      new Kowalski.Statistic('Visitors per campaign', countPerCampaign),
      new Kowalski.Statistic('Visitors per path', countPerPath)
    ]
  }
}
