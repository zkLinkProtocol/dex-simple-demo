import { Web3ReactHooks } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { L1ChainId } from 'types'

export enum ConnectionType {
  INJECTED = 'INJECTED',
  BITGET = 'BITGET',
  OKX = 'OKX',
  COINBASE_WALLET = 'COINBASE_WALLET',
  WALLET_CONNECT_V2 = 'WALLET_CONNECT_V2',
  NETWORK = 'NETWORK',
  GNOSIS_SAFE = 'GNOSIS_SAFE',
}

export interface Connection {
  getName(): string
  connector: Connector
  hooks: Web3ReactHooks
  type: ConnectionType
  getIcon?(isDarkMode: boolean): string
  shouldDisplay(): boolean
  overrideActivate?: (chainId?: L1ChainId) => boolean
}

export interface RecentConnectionMeta {
  type: ConnectionType
  address?: string
  ENSName?: string
  disconnected?: boolean
}
