const express = require('express')
const mongoose = require('mongoose')

const Kowalski = require('../../')

const app = express()

// Saves data to a mongodb db
const mongoStorage = Storage => class extends Storage {
  // Storages receive all informationToCollect classes so they can create schemas/models
  constructor (informationToCollect) {
    super()
    this.connection = mongoose.createConnection('mongodb://localhost/kowalski_analytics', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    for (const Information of informationToCollect) this.connection.model(Information.name, new mongoose.Schema({}, { strict: false }))
  }

  getInformation (name, start, end) {
    //
  }

  _write (data, encoding, done) {
    const Model = this.connection.model(data.constructor.name)
    Model.create(data.getInformation(), error => done(error))
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
