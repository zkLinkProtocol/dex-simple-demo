import { BigNumber, FixedNumber } from 'ethers'
import { Ether, Wei } from '../types'
import { bn, isZero } from './number'

export const fastWithdrawFeeAmountToRatio = (amount: Ether, fee: Ether) => {
  try {
    const a = FixedNumber.from(fee)
      .divUnsafe(FixedNumber.from(amount))
      .mulUnsafe(FixedNumber.from(10000))
      .toString()
    return parseInt(a)
  } catch (e) {
    return ''
  }
}

// export const FastWithdrawFeeRatio: string = '0.005'
// calc fee amount by ratio
export const fastWithdrawFeeRatioToAmount = (
  amount: BigNumber,
  ratio: number // e.g. 50, ten thousand points
): BigNumber => {
  if (isZero(amount) || isZero(ratio)) {
    return bn(0)
  }
  return amount.mul(ratio).div(10000)
}

const minFeeRate = 10 // 10 / 10000

export function fastWithdrawTieredRates(
  amount: BigNumber,
  limit: Wei | BigNumber,
  maxFeeRate: number
) {
  limit = bn(limit)

  if (amount.isZero() || limit.isZero()) {
    return minFeeRate
  }
  const scaleFactor = 10000
  const ratio = amount.mul(scaleFactor).div(limit)
  const feeRate = bn(maxFeeRate)
    .sub(ratio.mul(maxFeeRate - minFeeRate).div(scaleFactor))
    .toNumber()

  if (feeRate > maxFeeRate) {
    return maxFeeRate
  }
  if (feeRate < minFeeRate) {
    return minFeeRate
  }
  return feeRate
}
