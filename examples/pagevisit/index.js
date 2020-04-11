const express = require('express')
const mongoose = require('mongoose')

const Kowalski = require('../../')

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
    this.getInformation('kowalski:utm').then(console.log)
  }
}

app.use(new Kowalski({
  informationToCollect: [
    Kowalski.Information.PageVisit, // track page visits
    Kowalski.Information.UTM // track campaign stuff
  ],
  storages: [mongoStorage]
}))

app.get('/hello', (req, res, next) => res.send('hi!'))
app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
