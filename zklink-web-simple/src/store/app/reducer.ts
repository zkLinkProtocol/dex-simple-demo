import { createReducer } from '@reduxjs/toolkit'
import {
  cleanModal,
  getChainsActions,
  getTokensActions,
  updateActionState,
  updateCurrentNetwork,
  updateFaucetQueueLen,
  updateModal,
  updateOpenRenderFlag,
  updateStaticContracts,
} from './actions'
import { AppState } from './types'

const initialState: AppState = {
  actionState: {
    ethereumBalancesPulling: false,
    ordering: false,
  },
  chains: [],
  tokens: [],
  changePubKeyChainId: 0,
  ethProperty: {
    chainId: 0,
    layerOneChainId: 0,
    gasTokenId: 0,
    depositConfirmation: 0,
    gateways: [],
  },
  currentNetwork: 0,
  contracts: {
    multicall: {},
    faucet: {},
  },
  gas: {},
  gasLimit: {},
  modal: {
    marketDrawer: false,
    spotMarkets: false,
    perpMarkets: false,
    account: false,
    wallets: false,
    verify: false,
    guide: false,
    depositing: false,
    faucet: false,
    deposit: false,
    withdraw: false,
    cancel: false,
    mobileUserOrder: false,
    confirmOrder: false,
    orderConfirmation: false,
    mobileNotice: false,
    shareTrading: false,
    perpCloseAll: false,
    perpCancelAll: false,
    leverage: false,
    rewardHistory: false,
    convert: false,
    pendingTxs: false,
    preference: false,
  },
  openRenderFlag: 0,
  faucetQueueLen: 0,
}

export default createReducer<AppState>(initialState, (builder) => {
  builder
    .addCase(updateActionState, (state, { payload }) => {
      state.actionState[payload.action] = payload.state
    })
    .addCase(getChainsActions.fulfilled, (state, { payload }) => {
      const { chains, changePubKeyChainId, ethProperty } = payload
      state.chains = chains
      state.changePubKeyChainId = changePubKeyChainId
      state.ethProperty = ethProperty
    })
    .addCase(getTokensActions.fulfilled, (state, { payload }) => {
      state.tokens = payload
    })
    .addCase(updateCurrentNetwork, (state, { payload }) => {
      state.currentNetwork = payload
    })
    .addCase(updateStaticContracts, (state, { payload }) => {
      state.contracts = {
        ...payload.contracts,
      }
    })
    .addCase(updateModal, (state, { payload }) => {
      state.modal[payload.modal] = payload.open
    })
    .addCase(cleanModal, (state, { payload }) => {
      // close all modal
      let key: keyof typeof state.modal
      for (key in state.modal) {
        state.modal[key] = false
      }
    })
    .addCase(updateOpenRenderFlag, (state, { payload }) => {
      state.openRenderFlag = payload.flag
    })
    .addCase(updateFaucetQueueLen, (state, { payload }) => {
      state.faucetQueueLen = payload
    })
})
