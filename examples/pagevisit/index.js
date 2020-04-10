const stream = require('stream')

const express = require('express')
const mongoose = require('mongoose')

const Kowalski = require('../../')

const app = express()

// Saves data to a mongodb db
class MongoStorage extends stream.Writable {
  constructor () {
    super({ objectMode: true })
    this.connection = mongoose.createConnection('mongodb://localhost/kowalski_analytics', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  _write (data, encoding, done) {
    const Model = this.connection.models[data.constructor.name] || this.connection.model(data.constructor.name, new mongoose.Schema({}, { strict: false }))
    Model.create(data.getInformation(), error => done(error))
  }
}

app.use(new Kowalski({
  informationToCollect: [
    Kowalski.Information.PageVisit, // track page visits
    Kowalski.Information.UTM // track campaign stuff
  ],
  storages: [new MongoStorage()]
}))

app.get('/hello', (req, res, next) => res.send('hi!'))
app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
