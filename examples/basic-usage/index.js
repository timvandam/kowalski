const express = require('express')
const Kowalski = require('kowalski-analytics')
const mongooseStorage = require('kowalski-analytics-storage-mongoose')

const PageVisit = require('./PageVisit')
const LogIn = require('./LogIn')

const app = express()

app.use(new Kowalski({
  storage: mongooseStorage('mongodb://localhost/kowalski_analytics'), // save analytics in mongodb with mongoose
  informationToCollect: [
    PageVisit, // Collect the PageVisit metric defined in PageVisit.js
    LogIn // Collect the LogIn metric defined in LogIn.js
  ]
}))

function logIn (req, res, next) {
  // in a real app you would of course have a real log in routine
  req.user = { username: 'user name' }
  next()
}

app.post('/login', logIn, (req, res, next) => {
  // Make Kowalski collect the LogIn metric after a succesful log in
  req.kowalski.triggerInfoCollect('LogIn', req.user.username)
  res.send('Logged in!')
})

app.get('/fetchLogins', (req, res, next) => {
  // You can use the provided storage to fetch collected metrics
  // req.kowalski.storage is set by the provided storage, so its behavior is
  // completely dependent on the storage you are using
  req.kowalski.storage.model('login').find().then(logInStats => {
    // Get only relevant data and send it as response
    const logIns = logInStats.map(logIn => logIn.getInformation().data)
    res.json(logIns)
  })
})

app.listen(process.env.PORT || 8080, () => console.log('Server is online!'))
