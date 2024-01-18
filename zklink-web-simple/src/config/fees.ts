import { L1ChainId } from 'types'
import { MainnetChainIds } from './chains'

export const BaseFeeUSD = 0.2 // 0.2 USD

export const DefaultGas = 5 // Gwei
export const DefaultGasLimit = 100000 // 100,000 ~ 1.2 USD

export const SpecifyGas: Record<L1ChainId, number> = {}
export const SpecifyGasLimit: Record<L1ChainId, number> = {
  [MainnetChainIds.Ethereum]: 1000000, // ~ 12 USD
}
