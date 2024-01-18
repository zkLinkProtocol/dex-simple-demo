import { createReducer } from '@reduxjs/toolkit'
import {
  disconnectLink,
  updateConnected,
  updateEthereumBalances,
  updateLinkStatus,
  updateLinkWallet,
  updateViewInExplorerLink,
} from 'store/link/actions'
import { LinkState, LinkStatus } from 'store/link/types'

const initialState: LinkState = {
  connected: false,
  chainId: 0,
  signer: undefined,
  ethereumBalances: {},
  viewInExplorerLink: '',
  linkStatus: LinkStatus.init,
}

export default createReducer<LinkState>(initialState, (builder) => {
  builder
    .addCase(updateConnected, (state, { payload }) => {
      state.connected = payload.connected
    })
    .addCase(updateEthereumBalances, (state, { payload }) => {
      const { ethereumBalances } = payload
      for (let layerOneChainId in ethereumBalances) {
        if (!state.ethereumBalances[layerOneChainId]) {
          state.ethereumBalances[layerOneChainId] = {}
        }

        for (let address in ethereumBalances[layerOneChainId]) {
          state.ethereumBalances[layerOneChainId][address.toLowerCase()] =
            ethereumBalances[layerOneChainId][address.toLowerCase()]
        }
      }
    })
    .addCase(updateLinkWallet, (state, { payload }) => {
      state.signer = payload.signer
      state.chainId = payload.chainId
      state.connected = true
    })
    .addCase(updateViewInExplorerLink, (state, { payload }) => {
      state.viewInExplorerLink = payload.url
    })
    .addCase(disconnectLink, (state, { payload }) => {
      state.signer = undefined
      state.connected = false
      state.chainId = 0
    })
    .addCase(updateLinkStatus, (state, { payload }) => {
      state.linkStatus = payload
    })
})
