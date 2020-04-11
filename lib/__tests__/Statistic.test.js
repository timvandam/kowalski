const { InvalidArgumentException } = require('ezerrors')

const Statistic = require('../Statistic')

describe('constructor works', () => {
  it('when providing invalid arguments', () => {
    expect(() => new Statistic()).toThrow(new InvalidArgumentException('Name must be a string!'))
    expect(() => new Statistic('')).toThrow(new InvalidArgumentException('You must provide a name!'))
    expect(() => new Statistic('name', null)).toThrow(new InvalidArgumentException('You must provide data!'))
  })

  it('when providing valid arguments', () => {
    let stat
    expect(() => {
      stat = new Statistic('name', { metric: 2 })
    }).not.toThrow()
    expect(stat.data).toEqual({
      metric: '2'
    })
  })
})
