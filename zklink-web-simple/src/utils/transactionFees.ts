import { parseUnits } from '@ethersproject/units'
import { Pow18 } from 'config'
import {
  BaseFeeUSD,
  DefaultGas,
  DefaultGasLimit,
  SpecifyGas,
  SpecifyGasLimit,
} from 'config/fees'
import { BigNumber } from 'ethers'
import { store } from 'store'
import { Ether, L1ChainId, TokenId } from 'types'
import { e2w } from './number'

export enum TransactionType {
  Transfer,
  Withdraw,
}
export function getTransactionFees(
  type: TransactionType,
  chainId: L1ChainId,
  tokenId: TokenId
) {
  const state = store.getState()
  const { tokens } = state.app
  const token = tokens.find((t) => t.id === tokenId)

  if (!token) {
    throw new Error('Invalid token id.')
  }

  if (type === TransactionType.Transfer) {
    return getBaseFee(token.usdPrice)
  }

  if (type === TransactionType.Withdraw) {
    return getWithdrawFee(chainId, token.usdPrice)
  }

  throw new Error('Invalid transaction type.')
}

export function getBaseFee(price: number | Ether): BigNumber {
  price = Number(price)
  if (Number.isNaN(price)) {
    throw new Error('Invalid price: Price must be a number.')
  }
  if (price <= 0) {
    throw new Error('Invalid price: Price must be greater than zero.')
  }
  // Calculate the amount of tokens equivalent to 0.2 USD.
  const tokenAmount = e2w(BaseFeeUSD).mul(Pow18).div(e2w(price))

  return tokenAmount
}

export function getWithdrawFee(chainId: L1ChainId, price: number | Ether) {
  price = Number(price)
  if (Number.isNaN(price)) {
    throw new Error('Invalid price: Price must be a number.')
  }
  if (price <= 0) {
    throw new Error('Invalid price: Price must be greater than zero.')
  }

  const state = store.getState()
  const { chains, tokens } = state.app

  const gasTokenId = chains.find(
    (v) => v.layerOneChainId === chainId
  )?.gasTokenId
  if (!gasTokenId) {
    throw new Error('Invalid gas token id.')
  }
  const gasTokenPrice = tokens.find((t) => t.id === gasTokenId)?.usdPrice

  if (!gasTokenPrice) {
    throw new Error('Invalid gas token price.')
  }
  const chainGas = SpecifyGas[chainId] ?? DefaultGas
  const chainGasLimit = SpecifyGasLimit[chainId] ?? DefaultGasLimit

  const gasUsed = parseUnits(String(chainGas), 'gwei').mul(chainGasLimit)

  const gasUsedValue = gasUsed.mul(e2w(gasTokenPrice)).div(Pow18)

  const tokenAmount = gasUsedValue.mul(Pow18).div(e2w(price))

  return tokenAmount
}
