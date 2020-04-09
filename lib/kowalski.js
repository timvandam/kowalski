class Kowalski {}

function kowalski (...args) {
  return new Kowalski(...args)
}

module.exports = kowalski
