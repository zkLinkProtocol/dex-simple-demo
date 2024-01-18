import { Pow18 } from 'config'
import { Ether } from 'types'
import { e2w, isZero, toFixed, w2e } from 'utils/number'

export const fastWithdrawFeeAmountToRatio = (amount: Ether, fee: Ether) => {
  try {
    const feeWei = e2w(fee).mul(Pow18).div(e2w(amount)).mul('10000')
    return parseInt(w2e(feeWei))
  } catch (e) {
    return ''
  }
}

export const FastWithdrawFeeRatio: string = '0.005'
// calc fee amount by ratio
export const fastWithdrawFeeRatioToAmount = (
  amount: Ether,
  ratio?: string
): Ether => {
  try {
    if (isZero(amount)) {
      return '0'
    }
    if (!ratio) {
      ratio = FastWithdrawFeeRatio
    }
    const feeWei = e2w(ratio).mul(e2w(amount)).div(Pow18)
    return toFixed(w2e(feeWei), 4)
  } catch (e) {
    return ''
  }
}

// convert ten thousand points to uint16
export const getFeeTenThousandPoints = (): number => {
  try {
    const rWei = e2w(FastWithdrawFeeRatio).mul(10000)
    const n = parseInt(w2e(rWei))
    if (n > 10000) {
      return 10000
    }
    if (n < 0) {
      return 0
    }
    return n
  } catch (e) {
    return 0
  }
}
