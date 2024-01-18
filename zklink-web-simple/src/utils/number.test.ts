import { inputNumberExp, numberToString, toFixed } from './number'

describe('toFixed', () => {
  it('case: (), return: "0"', () => {
    const r = toFixed(undefined as any)
    expect(r).toEqual('')
  })
  it('case: (0), return: "0"', () => {
    const r = toFixed(0)
    expect(r).toEqual('0')
  })
  it('case: (1), return: "1"', () => {
    const r = toFixed('1')
    expect(r).toEqual('1')
  })
  it('case: ("0"), return: "0"', () => {
    const r = toFixed('0')
    expect(r).toEqual('0')
  })
  it('case: ("1."), return: "1"', () => {
    const r = toFixed('1.')
    expect(r).toEqual('1.')
  })
  it('case: ("1.0"), return: "1"', () => {
    const r = toFixed('1.0')
    expect(r).toEqual('1.0')
  })
  it('case: ("1.0000000000"), return: "1.0000"', () => {
    const r = toFixed('1.0000000000', 2)
    expect(r).toEqual('1.00')
  })
  it('case: ("1.000000000000001", 4), return: "1.0000"', () => {
    const r = toFixed('1.05', 1)
    expect(r).toEqual('1.0')
  })
  it('case: ("1.0000000000195125", 16), return: "1.0000000000195125"', () => {
    const r = toFixed('1.0000000000195125', 16)
    expect(r).toEqual('1.0000000000195125')
  })
  it('case: ("239042058345363461.000000000019512511111111", 16), return: "239042058345363461.0000000000195125"', () => {
    const r = toFixed('239042058345363461.000000000019512511111111', 16)
    expect(r).toEqual('239042058345363461.0000000000195125')
  })

  it('case: ("10")', () => {
    const r = toFixed('10', 4, { fixed: true })
    expect(r).toEqual('10.0000')
  })
  it('case: ("-10")', () => {
    const r = toFixed('-10', 4, { fixed: true })
    expect(r).toEqual('-10.0000')
  })
  it('case: ("0")', () => {
    const r = toFixed('0', 4, { fixed: true })
    expect(r).toEqual('0.0000')
  })
  it('case: ("0.3825934796")', () => {
    const r = toFixed('0.38259347960', 4, { fixed: true })
    expect(r).toEqual('0.3825')
  })
  it('case: ("0.000000")', () => {
    const r = toFixed('0.000000', 4, { fixed: true })
    expect(r).toEqual('0.0000')
  })
  it('case: ("4357.4564589645")', () => {
    const r = toFixed('4357.4564589645', 8, { fixed: true })
    expect(r).toEqual('4357.45645896')
  })
})

describe('inputNumberExp', () => {
  it('case: ("34lkj355"), return: "', () => {
    const r = inputNumberExp('34lkj355')
    expect(r).toEqual('34355')
  })
  it('case: ("34lkj355i&*#@%:"$:"#%"), return: "', () => {
    const r = inputNumberExp('2&54l*#@%:"$:"#%"')
    expect(r).toEqual('254')
  })
  it('case: ("1.2.6"), return: ""', () => {
    const r = inputNumberExp('1.2.6')
    expect(r).toEqual('1.26')
  })
  it('case: ("1..6"), return: ""', () => {
    const r = inputNumberExp('1..6')
    expect(r).toEqual('1.6')
  })
})

describe('numberToString', () => {
  it('case: (9.4E-5), return: 100000000000000000000"', () => {
    const r = numberToString(9.4e-5)
    expect(r).toEqual('0.000094')
  })
  it('case: (5.0E-4), return: 100000000000000000000"', () => {
    const r = numberToString(5.0e-4)
    expect(r).toEqual('0.0005')
  })
  it('case: (1e20), return: 100000000000000000000"', () => {
    const r = numberToString(1e20)
    expect(r).toEqual('100000000000000000000')
  })
  it('case: (-1e20), return: -100000000000000000000"', () => {
    const r = numberToString(-1e20)
    expect(r).toEqual('-100000000000000000000')
  })
})
