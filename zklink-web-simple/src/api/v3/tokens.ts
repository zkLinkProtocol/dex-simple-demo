import {
  Address,
  Ether,
  L2ChainId,
  L2TokenId,
  Timestamp,
  TokenId,
  TokenSymbol,
  Wei,
} from 'types'
import { jsonrpc } from './jsonrpc'

export interface Currency {
  id: number // 100, zklink currency id
  name: TokenSymbol // "BTC", zklink currency name
  main: boolean // false, can it be used as a contract margin
  conversionRatio: number // 1.0, margin conversion ratio
  displayName: string // "Bitcoin", zklink currency name
  createdAt: Timestamp // 1680278400000
  tokenIconUrl: string // https://xxx.com/xx.svg
  l2CurrencyId: L2TokenId // 150, layer2 currency id
  l2Symbol: TokenSymbol
  usdPrice: Ether
  chains: {
    [x: L2ChainId]: CurrencyChainInfo
  }
}
export interface CurrencyChainInfo {
  chainId: L2ChainId // 1 or 2 ... or 7
  address: Address // "0x0000000000000000000000000000000000000000"
  decimals: number // 18
  fastWithdraw: boolean // true
}

export async function getSupportTokens() {
  return await jsonrpc<Currency[]>('getSupportTokens', [])
}

export interface TokenReserve {
  [x: L2ChainId]: Wei
}

/**
 * @param tokenId zklink currency id
 * @param mapping withdrawal case (USD -> USDC) = true , (USDC -> USDC) = false
 */
export async function getTokenReserve(
  tokenId: TokenId,
  mapping: boolean = false
) {
  return await jsonrpc<TokenReserve>('getTokenReserve', [tokenId, mapping])
}
