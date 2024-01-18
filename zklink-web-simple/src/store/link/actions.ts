import { createAction } from '@reduxjs/toolkit'
import { EthereumBalances, FundsData, LinkStatus } from 'store/link/types'
import { sdk } from 'utils/signer/utils'

export const updateConnected = createAction<{ connected: boolean }>(
  'link/updateConnected'
)
export const updateFunds = createAction<{
  funds: { [index: string]: FundsData }
}>('link/updateFunds')
export const updatePortfolio = createAction<{ portfolio: any[] }>(
  'link/updatePortfolio'
)
export const updateAccountLockState = createAction<{ isLocked: boolean }>(
  'link/updateAccountLockState'
)
export const updateEthereumBalances = createAction<{
  ethereumBalances: EthereumBalances
}>('link/updateEthereumBalances')
export const updateLinkWallet = createAction<{
  chainId: number
  signer: sdk.JsonRpcSigner | undefined
}>('link/updateLinkWallet')
export const updateViewInExplorerLink = createAction<{
  url: string
}>('link/updateViewInExplorerLink')
export const disconnectLink = createAction('link/disconnectLink')
export const updateActivating = createAction<{ activating: boolean }>(
  'link/updateActivating'
)
export const updateLinkStatus = createAction<LinkStatus>(
  'link/updateLinkStatus'
)
