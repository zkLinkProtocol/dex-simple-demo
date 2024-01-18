import { parseEther } from 'ethers/lib/utils'
import {
  fastWithdrawFeeAmountToRatio,
  fastWithdrawTieredRates,
} from './fastWithdrawFee'

describe('fastWithdrawRatio()', () => {
  it('case: ', () => {
    const r = fastWithdrawFeeAmountToRatio('300', '0.05')
    expect(r).toBe(1)
  })
})

describe('tiered fees', () => {
  it('1 / 1000', () => {
    const r = fastWithdrawTieredRates(parseEther('1'), parseEther('1000'), 50)
    expect(r).toBe(50)
  })
  it('500 / 1000', () => {
    const r = fastWithdrawTieredRates(parseEther('500'), parseEther('1000'), 50)
    expect(r).toBe(30)
  })
  it('1000 / 1000', () => {
    const r = fastWithdrawTieredRates(
      parseEther('1000'),
      parseEther('1000'),
      50
    )
    expect(r).toBe(10)
  })
  it('5000 / 1000', () => {
    const r = fastWithdrawTieredRates(
      parseEther('5000'),
      parseEther('1000'),
      50
    )
    expect(r).toBe(10)
  })
})
