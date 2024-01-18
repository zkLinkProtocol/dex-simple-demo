import { BigNumber } from 'ethers'
import { L1ChainId, L2ChainId } from 'types'
import { MainnetChainIds, TestnetChainIds } from './chains'

// GovernorAddresses is used to verify the validity of the target main contract for deposits.
export const GovernorAddresses: Record<L1ChainId, string> = {
  // [MainnetChainIds.Avalanche]: '0x00000000000000000000000005be6f6be56e86d3b4cdac9e7496e024ec427437',
}

// Set the blocked deposit chain id, hide the chains contained in the array in the deposit interface's chain list
export const BlockedDepositChains: L1ChainId[] = [MainnetChainIds.opBNB]

// The confirmations of the deposit transaction confirmed by the L1 chain.
export const DefaultDepositConfirmations = 64
export const DepositConfirmations: {
  [x: L1ChainId]: number
} = {
  [MainnetChainIds.Ethereum]: 64,
  [MainnetChainIds.Polygon]: 512,
  [MainnetChainIds.Avalanche]: 30,
  [MainnetChainIds.BSC]: 20,
  [MainnetChainIds.zkSyncEra]: 20,
  [MainnetChainIds.Linea]: 64,
  [MainnetChainIds.Arbitrum]: 100,
  [MainnetChainIds.Optimism]: 200,
}

// The estimated time for the deposit transaction to be transferred to the L2 chain.
export const DefaultDepositEstimateMinutes = 5
export const DepositEstimateMinutes: Record<L1ChainId, number> = {
  [TestnetChainIds.Goerli]: 25,
  [TestnetChainIds.Scroll]: 120,

  [MainnetChainIds.Polygon]: 10,
  [MainnetChainIds.Avalanche]: 1,
  [MainnetChainIds.BSC]: 1,
  [MainnetChainIds.Ethereum]: 25,
  [MainnetChainIds.zkSyncEra]: 1,
  [MainnetChainIds.Linea]: 1,
  [MainnetChainIds.Arbitrum]: 1,
}

// The chains in the array will be recommended to use 120% gas when recharging.
export const DEPOSIT_SUGGESTED_GAS: L2ChainId[] = []

// If the deposit transaction is not confirmed within the specified time,
// the transaction will be deleted from the pending list.
export const DEPOSIT_PENDING_TRANSACTION_TIMEOUT = 1000 * 60 * 60 * 3 // 3 hours

// The recommended gas limit for deposit transactions, if the chain is not defined in the special list.
export const ERC20_RECOMMENDED_DEPOSIT_GAS_LIMIT = '300000'
// The priority gas limit for deposit transactions, if the chain is defined in the special list.
export const ERC20_SPECIAL_DEPOSIT_GAS_LIMIT: Record<L1ChainId, string> = {
  [MainnetChainIds.zkSyncEra]: '3500000',
  [MainnetChainIds.Arbitrum]: '3500000',
}

export const MAX_ERC20_APPROVE_AMOUNT = BigNumber.from(
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
) // 2^256 - 1
