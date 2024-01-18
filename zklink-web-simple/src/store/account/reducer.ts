import { createReducer } from '@reduxjs/toolkit'
import { AccountInfo } from 'api/v3/account'
import { Address, TokenId, TokenSymbol, Wei } from 'types'
import { isZeroAddress } from 'utils/address'
import {
  getAccountBalanceAction,
  getAccountInfoAction,
  signoutAction,
  updateAccountActivatingAction,
  updateAccountInfo,
  updateAccountTickets,
  updateBalancesAction,
  updateUserToken,
} from './actions'

export interface CurrencyBalance {
  currencyId: TokenId
  currency: TokenSymbol
  main: boolean
  available: Wei
  freeze: Wei
}

export interface AccountTickets {
  address: Address
  signature: string
  pubKey: string
}

export enum AccountStatus {
  NotFound,
  Inactivate,
  Activated,
  Deactivated,
}

export interface AccountState {
  accountInfo: AccountInfo | null
  accountStatus: AccountStatus
  activating: boolean
  tickets?: AccountTickets
  balances: CurrencyBalance[]
  token: string
}

const initialState: AccountState = {
  accountInfo: null,
  accountStatus: AccountStatus.NotFound,
  // When the user clicks the activation button until the signing process in the wallet is completed, this value should be 'true.'
  // The activation status of 'accountInfo.status' is not stable and can be overwritten by the polling mechanism.
  activating: false,
  tickets: undefined,
  balances: [],
  token: '',
}

export default createReducer<AccountState>(initialState, (builder) => {
  builder
    .addCase(getAccountInfoAction.fulfilled, (state, { payload }) => {
      state.accountInfo = payload
      if (payload) {
        if (isZeroAddress(payload.pubKeyHash)) {
          state.accountStatus = AccountStatus.Inactivate
        } else {
          state.accountStatus = AccountStatus.Activated
        }
      } else {
        state.accountStatus = AccountStatus.NotFound
      }
    })
    .addCase(updateAccountInfo, (state, { payload }) => {
      state.accountInfo = payload
    })
    .addCase(updateAccountActivatingAction, (state, { payload }) => {
      state.activating = payload
    })
    .addCase(getAccountBalanceAction.fulfilled, (state, { payload }) => {
      state.balances = payload
    })
    .addCase(updateBalancesAction, (state, { payload }) => {
      const index = state.balances.findIndex(
        (b) => b.currencyId === payload.currencyId
      )
      if (index > -1) {
        state.balances[index].available = payload.available
        state.balances[index].freeze = payload.freeze
      }
    })
    .addCase(updateAccountTickets, (state, { payload }) => {
      state.tickets = payload
    })
    .addCase(updateUserToken, (state, { payload }) => {
      state.token = payload
    })
    .addCase(signoutAction, (state) => {
      state.token = ''
      state.balances = []
      state.accountInfo = null
    })
})
