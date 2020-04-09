const express = require('express')
const stream = require('stream')

const Kowalski = require('../../')

const app = express()

// Logs all data Kowalski emits
class LogStorage extends stream.Writable {
  constructor () {
    super({ objectMode: true })
  }

  _write (data, encoding, next) {
    console.log(data)
    next()
  }
}

app.use(new Kowalski({
  informationToCollect: [Kowalski.Information.PageVisit], // PageVisit instances will be emitted to storages
  storages: [new LogStorage()]
}))

app.get('/hello', (req, res, next) => res.send('hi!'))
app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
