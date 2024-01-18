import { Currency } from 'api/v3/tokens'
import {
  MAPPING_TOKEN_BEGIN,
  MAPPING_TOKEN_END,
  STABLE_TOKEN_BEGIN,
  STABLE_TOKEN_END,
} from 'config/currencies'
import { L2ChainId, TokenId, TokenSymbol } from '../types'

export const isUSD = (id: TokenId) => {
  return id === 1
}

export const isUSDStableCoins = (
  id: TokenId,
  hasCheckUSD: boolean = false
): boolean => {
  return (
    (hasCheckUSD && isUSD(id)) ||
    (id >= STABLE_TOKEN_BEGIN && id <= STABLE_TOKEN_END)
  )
}

export function getMappingTokenId(tokenId: TokenId) {
  if (!isUSDStableCoins(tokenId)) {
    return 0
  }

  const id = Math.floor(tokenId - 15)
  if (id > 16) {
    return 0
  }
  return id
}

export function isMappingToken(tokenId: TokenId) {
  if (MAPPING_TOKEN_BEGIN <= tokenId && tokenId <= MAPPING_TOKEN_END) {
    return true
  }
  return false
}

export function isLpToken(tokenId: number) {
  if (
    tokenId === undefined ||
    tokenId === null ||
    Number.isNaN(Number(tokenId))
  ) {
    return false
  }
  return tokenId >= MAPPING_TOKEN_BEGIN && tokenId <= MAPPING_TOKEN_END
}

export function eqSymbol(tokenSymbolA: TokenSymbol, tokenSymbolB: TokenSymbol) {
  if (tokenSymbolA === undefined || tokenSymbolB === undefined) {
    return false
  }
  return tokenSymbolA.toUpperCase() === tokenSymbolB.toUpperCase()
}

export function getTokenDecimals(token: Currency, chainId: L2ChainId) {
  if (!token || !chainId) {
    return 0
  }
  return token?.chains?.[chainId]?.decimals
}

export function getTokenAddress(token: Currency, chainId: L2ChainId) {
  if (!token || !chainId) {
    return ''
  }
  return token?.chains?.[chainId]?.address
}
