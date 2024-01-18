import { fastWithdrawFeeAmountToRatio } from './fee'

describe('fastWithdrawRatio()', () => {
  it('case: ', () => {
    const r = fastWithdrawFeeAmountToRatio('300', '0.05')
    expect(r).toBe(1)
  })
})
