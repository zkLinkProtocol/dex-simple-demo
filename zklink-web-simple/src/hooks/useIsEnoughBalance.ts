import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import { parseEtherToWei } from 'utils/number'
import { Ether, Wei } from '../types'

export function isEnoughBalance(
  amount: Ether,
  balance: Wei | BigNumber
): boolean | null {
  if (amount === undefined || balance === undefined || balance === '') {
    return null
  }
  const numAmount = Number(amount)
  if (Number.isNaN(numAmount)) {
    return null
  }

  return parseEtherToWei(amount).lte(balance)
}

export const useIsEnoughBalance = (
  amount: Ether,
  balance: Wei | BigNumber
): boolean | null => {
  return useMemo(() => {
    return isEnoughBalance(amount, balance)
  }, [amount, balance])
}

export default useIsEnoughBalance
