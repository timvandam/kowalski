const path = require('path')

const express = require('express')
const mongoose = require('mongoose')

const Kowalski = require('../../')
const PageVisit = require('./InformationTypes/PageVisit')
const UTM = require('./InformationTypes/UTM')
const kowalskiApi = require('../../../kowalski-api')

const app = express()

// Saves data to a mongodb db
const mongoStorage = class extends Kowalski.Storage {
  // Storages receive all informationToCollect classes so they can create schemas/models
  constructor (informationTypes) {
    super(informationTypes)
    this.connection = mongoose.createConnection('mongodb://localhost/kowalski_analytics', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    for (const Information of this.informationTypes.values()) this.connection.model(Information.name, new mongoose.Schema({}, { strict: false }))
  }

  async _getInformation (Information, start, end) {
    const docs = await this.connection.model(Information.name).find({
      date: {
        $gt: start,
        $lt: end
      }
    })
    return docs.map(doc => doc.toObject())
  }

  _write (data, encoding, done) {
    const Model = this.connection.model(data.constructor.name)
    Model.create(data.getInformation(), error => done(error))
  }
}

app.use(express.static(path.resolve(__dirname, '../../../kowalski-ui/build')))

app.use(new Kowalski({
  informationToCollect: [PageVisit, UTM],
  storage: mongoStorage
}))

app.use('/kowalski', kowalskiApi)

app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
