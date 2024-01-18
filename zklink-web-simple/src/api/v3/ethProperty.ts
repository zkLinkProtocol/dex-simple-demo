import { L1ChainId, L2ChainId, TokenAddress, TokenId } from '../../types'
import { jsonrpc } from './jsonrpc'

export interface GatewayInfo {
  chainId: L2ChainId
  l1GatewayContract: string
  l2GatewayContract: string
  tokens: Array<{
    tokenId: TokenId
    tokenAddress: TokenAddress
    decimal: number
    fastWithdraw: boolean
  }>
}

export interface EthProperty {
  chainId: L2ChainId
  layerOneChainId: L1ChainId
  gasTokenId: number
  depositConfirmation: number
  gateways: GatewayInfo[]
}

export async function getEthProperty() {
  return await jsonrpc<EthProperty>('getEthProperty', [])
}
