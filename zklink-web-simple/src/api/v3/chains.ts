import axios from 'axios'
import { ZKLINK_STATIC_ENDPOINT } from '../../config'
import { Address, L1ChainId, L2ChainId, Timestamp, TokenId } from '../../types'
import { EthProperty } from './ethProperty'
import { jsonrpc } from './jsonrpc'

// Fetch the network profile from static server add to ChainInfo
type ChainAdditional = Partial<
  Pick<
    NetworkInfo,
    'name' | 'symbol' | 'decimals' | 'rpcUrl' | 'explorerUrl' | 'iconUrl'
  >
>

export interface ChainInfo extends ChainAdditional {
  // zklink response
  chainId: L2ChainId // 1 or 2 ... or 7
  layerOneChainId: L1ChainId // 80001 or 43113
  mainContract: Address // "0x0000000000000000000000000000000000000000"
  layerZeroContract: string // "0x0000000000000000000000000000000000000000000000000000000000000000"
  gasTokenId: TokenId
  depositConfirmation: number

  id: number // 31
  isSupport: boolean // true
  updateTime: Timestamp // 1684493882294

  // frontend added
  // true means that communication requires the use of the 'l1GatewayContract' address from the 'gateways'.
  gateway: boolean
  // copied from chainId
  // if gateway field is set to true, this field will be undefined.
  layerTwoChainId: L2ChainId // 1 or 2 ... or 7
  // Data from static.zk.link/networks/list.json
  // Used to add network profile to Wallet
  decimals: number // 18
}

export interface GetChainsResponse {
  chains: (ChainInfo & { layerOneChainId: string })[]
  changePubkeyChainId: L2ChainId
  ethProperty: EthProperty
}

export async function getSupportChains() {
  return await jsonrpc<(ChainInfo & { layerOneChainId: string })[]>(
    'getSupportChains',
    []
  )
}

export interface NetworkInfo {
  name: string
  chainId: L1ChainId
  layerTwoChainId: L2ChainId
  symbol: string
  decimals: number
  rpcUrl: string
  explorerUrl: string
  iconUrl: string
}

export async function getStaticNetworksProfile<
  T extends NetworkInfo[]
>(): Promise<T> {
  return await axios
    .get('/networks/list.json', {
      baseURL: ZKLINK_STATIC_ENDPOINT,
    })
    .then((r) => r.data)
}

export async function getChangePubkeyChainId() {
  return await jsonrpc<L1ChainId>('getChangePubkeyChainId', [])
}
