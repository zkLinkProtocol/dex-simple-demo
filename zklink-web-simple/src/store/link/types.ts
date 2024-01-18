import { Address, L1ChainId, Wei } from 'types'
import { sdk } from 'utils/signer/utils'

export interface EthereumBalances {
  [x: L1ChainId]: Record<Address, Wei>
}
export interface FundsData {
  openingPrice: string
  closingPrice: string
  percent: string
  currentBalance?: string
  openingBalance?: string
  amount?: string
}
export enum LinkStatus {
  init,
  linkL1Pending,
  linkL1Success,
  linkL1Failed,
  linkL2Pending,
  linkL2Success,
  linkL2Failed,
}
export interface LinkState {
  connected: boolean
  chainId: L1ChainId
  signer: sdk.JsonRpcSigner | undefined
  ethereumBalances: EthereumBalances
  viewInExplorerLink: string
  linkStatus: LinkStatus
}
