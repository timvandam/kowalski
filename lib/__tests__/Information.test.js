const { NotImplementedException } = require('ezerrors')

const Information = require('../Information')

it('constructor works', () => {
  expect(() => new Information()).not.toThrow()
  expect(new Information().date).toEqual(expect.any(Date))
})

it('NoInformation works', () => {
  expect(Information.NoInformation).toEqual({})
})

it('name works', () => {
  expect(() => Information.name).toThrow(new NotImplementedException('Abstract static name was not set!'))
})

it('_getInformation works', () => {
  expect(() => new Information().getInformation()).toThrow(new NotImplementedException('Abstract _getInformation was not implemented!'))
})

it('getInformation works', () => {
  const info = new (class extends Information {
    _getInformation () {
      return {
        a: 1,
        b: 2
      }
    }
  })()
  expect(info.getInformation()).toEqual({
    date: expect.any(Date),
    a: 1,
    b: 2
  })
})

it('serializeInformation works', () => {
  expect(() => Information.serializeInformation([])).toThrow(new NotImplementedException('Abstract static serializeInformation was not implemented!'))
})
