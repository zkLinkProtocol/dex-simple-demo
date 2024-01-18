import {
  ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT,
  ERC20_SPECIAL_DEPOSIT_GAS_LIMIT,
} from 'config/deposit'
import { BigNumber } from 'ethers'
import { L1ChainId } from 'types'
import { bn } from './number'

export function getRecommendedDepositGasLimit(chainId: L1ChainId): BigNumber {
  const gasLimit =
    ERC20_SPECIAL_DEPOSIT_GAS_LIMIT[chainId] ??
    ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT
  return bn(gasLimit)
}
