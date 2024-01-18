import { createReducer } from '@reduxjs/toolkit'
import { HistoryTabType } from 'views/History/Tab'
import {
  clearHistoryAction,
  getDepositHistoryAction,
  updateHistoryTabAction,
  updateTransferList,
  updateTransferTotal,
  updateWithdrawList,
  updateWithdrawTotal,
} from './actions'
import { HistoryState } from './types'

const initialState: HistoryState = {
  historyTab: HistoryTabType.DashBoard,
  deposit: {
    total: 0,
    list: [],
  },
  withdraw: {
    total: 0,
    list: [],
  },
  transfer: {
    total: 0,
    list: [],
  },
}

export default createReducer<HistoryState>(initialState, (builder) => {
  builder
    .addCase(updateHistoryTabAction, (state, { payload }) => {
      state.historyTab = payload.tab
    })
    .addCase(updateWithdrawList, (state, { payload }) => {
      state.withdraw.list = payload
    })
    .addCase(updateTransferList, (state, { payload }) => {
      state.transfer.list = payload
    })
    .addCase(getDepositHistoryAction.fulfilled, (state, { payload }) => {
      if (payload) {
        state.deposit.list = payload.list
        state.deposit.total = payload.total
      }
    })
    .addCase(updateWithdrawTotal, (state, { payload }) => {
      state.withdraw.total = payload
    })
    .addCase(updateTransferTotal, (state, { payload }) => {
      state.transfer.total = payload
    })
    .addCase(clearHistoryAction, (state) => {
      state.deposit.list = []
      state.deposit.total = 0
      state.withdraw.list = []
      state.withdraw.total = 0
      state.deposit.total = 0
      state.withdraw.total = 0
    })
})
