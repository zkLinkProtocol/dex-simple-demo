import { BigNumber } from '@ethersproject/bignumber'
import { bn } from './number'

// Improve the token amount to 18 decimal places.
// e.g. amount: 1000000, decimals: 6 = 1000000000000000000
export function improveDecimals(amount: BigNumber, decimals: number = 18) {
  if (decimals === 18) {
    return amount
  }
  return amount.mul(bn(10).pow(bn(18).sub(decimals)))
}

// Recover the token amount to the original decimal places.
// e.g. amount: 1000000000000000000, decimals: 6 = 1000000
export function recoveryDecimals(amount: BigNumber, decimals: number = 18) {
  if (decimals === 18) {
    return amount
  }
  return amount.div(bn(10).pow(bn(18).sub(decimals)))
}
