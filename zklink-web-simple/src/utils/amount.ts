import { MAX_DEPOSIT_CURRENCY_QUANTITY } from 'config/currencies'
import { BigNumber } from 'ethers'
import { Ether } from 'types'
import { toFixed } from './number'

export function computeReceiveAmount(
  amount: BigNumber,
  fee: BigNumber,
  balance: BigNumber
): BigNumber | undefined {
  if (!BigNumber.isBigNumber(amount)) {
    return undefined
  }
  if (!BigNumber.isBigNumber(fee)) {
    return undefined
  }
  if (!BigNumber.isBigNumber(balance)) {
    return undefined
  }
  if (balance.isZero()) {
    return BigNumber.from('0')
  }
  if (amount.isZero()) {
    return BigNumber.from('0')
  }
  if (fee.isZero()) {
    return amount
  }
  if (amount.add(fee).lt(balance)) {
    return amount
  } else {
    return balance.sub(fee)
  }
}

export function inputAmount(amount: Ether, decimals: number = 18) {
  if (Number(amount) >= Number(MAX_DEPOSIT_CURRENCY_QUANTITY)) {
    return String(MAX_DEPOSIT_CURRENCY_QUANTITY)
  }
  return toFixed(amount, decimals)
}
