import { ChainInfo } from 'api/v3/chains'
import { EthProperty } from 'api/v3/ethProperty'
import { Currency } from 'api/v3/tokens'
import { Address, L1ChainId, L2ChainId } from '../../types'

export interface ActionState {
  ethereumBalancesPulling: boolean
  ordering: boolean
}

export interface ModalState {
  marketDrawer: boolean
  spotMarkets: boolean
  perpMarkets: boolean
  account: boolean
  wallets: boolean
  verify: boolean
  guide: boolean
  depositing: boolean
  faucet: boolean
  deposit: boolean
  withdraw: boolean
  cancel: boolean
  mobileUserOrder: boolean
  confirmOrder: boolean
  orderConfirmation: boolean
  mobileNotice: boolean
  shareTrading: boolean
  perpCloseAll: boolean
  perpCancelAll: boolean
  leverage: boolean
  rewardHistory: boolean
  convert: boolean
  pendingTxs: boolean // Deposit Pending modal on footer
  preference: boolean
}
export type StaticContracts = {
  multicall: Record<L1ChainId, Address>
  faucet: Record<L1ChainId, Address>
}
export interface AppState {
  actionState: ActionState
  chains: ChainInfo[]
  tokens: Currency[]
  changePubKeyChainId: L2ChainId
  ethProperty: EthProperty
  currentNetwork: L1ChainId
  contracts: StaticContracts
  gas: Record<L1ChainId, number>
  gasLimit: Record<L1ChainId, number>
  modal: ModalState
  openRenderFlag: number
  faucetQueueLen: number
}
