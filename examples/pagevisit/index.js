const express = require('express')

const Kowalski = require('../../')
const PageVisit = require('./InformationTypes/PageVisit')
const UTM = require('./InformationTypes/UTM')
const mongoStorage = require('./mongoStorage')

const app = express()

// Saves data to a mongodb db

app.use(new Kowalski({
  informationToCollect: [PageVisit, UTM],
  storage: mongoStorage('mongodb://localhost/kowalski_analytics')
}))

app.get('/stat/:stat', async (req, res, next) => {
  const result = await req.kowalski.storage.model(req.params.stat.toLowerCase()).find()
  const infos = result.map(r => r.information)
  res.json(infos)
})
app.get('/hello/world', (req, res, next) => res.send('hello world!'))

app.listen(8080, () => console.log('Now listening on port 8080'))
