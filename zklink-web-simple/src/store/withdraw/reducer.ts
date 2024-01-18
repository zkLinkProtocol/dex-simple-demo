import { createReducer } from '@reduxjs/toolkit'
import { WithdrawLayoutType, WithdrawState } from 'store/withdraw/types'
import {
  fetchTokenReserveAction,
  fetchWithdrawalTransactions,
  updateAddOrEditAddress,
  updateAddressBookList,
  updateAmount,
  updateCurrentEditAddressBook,
  updateCurrentUseAddressBook,
  updateIsAddOrEditAddressBook,
  updateIsFocus,
  updateIsUseAddressBook,
  updateLayerNum,
  updateSelectFast,
  updateSelectedToken,
  updateShowAddAddress,
  updateShowAddressBookList,
  updateTitleName,
  updateWidthAddress,
  updateWithdrawStatus,
  updateWithdrawalTransactions,
  updateWithdrawing,
} from './actions'

const initialState: WithdrawState = {
  layoutType: WithdrawLayoutType.Withdraw,
  titleName: 'Withdraw',
  showAddressBookList: false,
  isFocus: false,
  showAddAddress: false,
  isUseAddressBook: false,
  addOrEditAddress: '',
  amount: '',
  addressBookList: [],
  currentEditAddressBook: undefined,
  currentUseAddressBook: undefined,
  isAddOrEditAddressBook: undefined,
  address: '',
  selectedToken: undefined,
  selectFast: false,
  withdrawStatus: {},
  txHash: [],
  withdrawing: false,
  withdrawLimit: {
    pending: false,
  },

  transactions: {
    pending: false,
    list: [],
    total: 0,
  },
}

export default createReducer<WithdrawState>(initialState, (builder) => {
  builder
    .addCase(updateLayerNum, (state, { payload }) => {
      state.layoutType = payload
    })
    .addCase(updateTitleName, (state, { payload }) => {
      state.titleName = payload
    })
    .addCase(updateShowAddressBookList, (state, { payload }) => {
      state.showAddressBookList = payload
    })
    .addCase(updateIsFocus, (state, { payload }) => {
      state.isFocus = payload
    })
    .addCase(updateShowAddAddress, (state, { payload }) => {
      state.showAddAddress = payload
    })

    .addCase(updateIsUseAddressBook, (state, { payload }) => {
      state.isUseAddressBook = payload
    })
    .addCase(updateAddOrEditAddress, (state, { payload }) => {
      state.addOrEditAddress = payload
    })
    .addCase(updateAmount, (state, { payload }) => {
      state.amount = payload
    })
    .addCase(updateAddressBookList, (state, { payload }) => {
      state.addressBookList = payload
    })
    .addCase(updateCurrentEditAddressBook, (state, { payload }) => {
      state.currentEditAddressBook = payload
    })
    .addCase(updateCurrentUseAddressBook, (state, { payload }) => {
      state.currentUseAddressBook = payload
    })
    .addCase(updateIsAddOrEditAddressBook, (state, { payload }) => {
      state.isAddOrEditAddressBook = payload
    })
    .addCase(updateWidthAddress, (state, { payload }) => {
      state.address = payload
    })
    .addCase(updateSelectedToken, (state, { payload }) => {
      state.selectedToken = payload
    })
    .addCase(updateSelectFast, (state, { payload }) => {
      state.selectFast = payload
    })
    .addCase(updateWithdrawStatus, (state, { payload }) => {
      const { txHash, status } = payload
      state.withdrawStatus[txHash] = status
    })
    .addCase(updateWithdrawing, (state, { payload }) => {
      state.withdrawing = payload
    })
    .addCase(fetchTokenReserveAction.pending, (state) => {
      state.withdrawLimit.pending = true
    })
    .addCase(fetchTokenReserveAction.fulfilled, (state, { payload }) => {
      const { tokenId, limit } = payload
      state.withdrawLimit.pending = false
      state.withdrawLimit[tokenId] = limit
    })
    .addCase(fetchTokenReserveAction.rejected, (state) => {
      state.withdrawLimit.pending = false
    })
    .addCase(fetchWithdrawalTransactions.pending, (state) => {
      state.transactions.pending = true
    })
    .addCase(fetchWithdrawalTransactions.fulfilled, (state, { payload }) => {
      const { list, total } = payload
      state.transactions.pending = false
      state.transactions.list = list
      state.transactions.total = total
    })
    .addCase(fetchWithdrawalTransactions.rejected, (state) => {
      state.transactions.pending = false
    })
    .addCase(updateWithdrawalTransactions, (state, { payload }) => {
      state.transactions.list = payload.list
      state.transactions.total = payload.total
    })
})
