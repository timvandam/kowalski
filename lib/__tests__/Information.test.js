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

it('_data works', () => {
  expect(() => new Information().data).toThrow(new NotImplementedException('Abstract _data was not set!'))
})

it('data works', () => {
  const info = new (class extends Information {
    _data () {
      return {
        a: 1,
        b: 2
      }
    }
  })()
  expect(info.data).toEqual({
    date: expect.any(Date),
    a: 1,
    b: 2
  })
})
