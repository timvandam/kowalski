const express = require('express')
const mongoose = require('mongoose')

const Kowalski = require('../../')
const PageVisit = require('./InformationTypes/PageVisit')
const UTM = require('./InformationTypes/UTM')

const app = express()

// Saves data to a mongodb db
const mongoStorage = class extends Kowalski.Storage {
  // Storages receive all informationToCollect classes so they can create schemas/models
  constructor (informationToCollect) {
    super()
    this.connection = mongoose.createConnection('mongodb://localhost/kowalski_analytics', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    for (const Information of informationToCollect) this.connection.model(Information.name, new mongoose.Schema({}, { strict: false }))
  }

  _getInformation (Information, start, end) {
    return this.connection.model(Information.name).find({
      date: {
        $gt: start,
        $lt: end
      }
    }).then(docs => docs.map(doc => doc.toObject()))
  }

  _write (data, encoding, done) {
    const Model = this.connection.model(data.constructor.name)
    Model.create(data.getInformation(), error => done(error))
  }
}

app.use(new Kowalski({
  informationToCollect: [
    PageVisit, // track page visits
    UTM // track campaign stuff
  ],
  storage: mongoStorage
}))

app.get('/stats/:stat', (req, res, next) => req.kowalski.storages[0].getInformation(req.params.stat).then(result => res.json(result)))
app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
