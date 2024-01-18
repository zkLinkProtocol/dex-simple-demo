import { createReducer } from '@reduxjs/toolkit'
import { lowerCase } from 'lodash'
import {
  addDepositPendingTxAction,
  removeMatchedDepositPendingTxAction,
  updateDepositAmountAction,
  updateDepositingAction,
  updateDepositModalOption,
  updateDepositStatus,
  updateDepositTokenAction,
  updateEthHash,
  updateIsDepositMobilePage,
  updateQueryL2Hash,
  updateTxConfirmations,
} from 'store/deposit/actions'
import {
  DepositModalOption,
  DepositStatus,
  TransactionsState,
} from 'store/deposit/types'

export const initialState: TransactionsState = {
  pendingTxs: [],
  depositStatus: {},
  ethHash: [],
  txConfirmations: {},
  queryL2Hash: [],
  modalOption: DepositModalOption.SelectOption,
  isMobilePage: false,
  depositing: false,
  amount: '',
  selectedToken: undefined,
}

export default createReducer<TransactionsState>(initialState, (builder) => {
  builder
    .addCase(addDepositPendingTxAction, (state, { payload }) => {
      const transaction = {
        ...payload,
      }
      state.pendingTxs = [...state.pendingTxs, transaction]
    })
    .addCase(removeMatchedDepositPendingTxAction, (state, { payload }) => {
      if (!payload.length) {
        return
      }
      if (!state.pendingTxs.length) {
        return
      }

      payload = payload.map((v) => lowerCase(v))

      // Important: Check the payload really has the matched txs
      // if skip the check, it will infinite loop !!!
      // Because the returned list(state.pendingTxs.filter) always is an new array
      const matchedTxs = state.pendingTxs.filter((item) => {
        return payload.includes(lowerCase(item?.tx?.ethHash))
      })

      if (matchedTxs.length) {
        state.pendingTxs = state.pendingTxs.filter(
          (item) => !payload.includes(lowerCase(item?.tx?.ethHash))
        )
      }
    })
    .addCase(updateDepositModalOption, (state, { payload }) => {
      state.modalOption = payload
    })
    .addCase(updateIsDepositMobilePage, (state, { payload }) => {
      state.isMobilePage = payload
    })
    .addCase(updateDepositStatus, (state, { payload }) => {
      if (!payload?.length) {
        return
      }
      for (let i in payload) {
        const { ethHash, status } = payload[i]

        // If the status is final, we don't need to update it
        if (
          state.depositStatus[ethHash] === DepositStatus.ZkLinkConfirmed ||
          state.depositStatus[ethHash] === DepositStatus.BlockFailed
        ) {
          continue
        }

        // Prevent the status is rollback
        if (state.depositStatus[ethHash] > status) {
          continue
        }
        state.depositStatus[ethHash] = status
      }

      const l1CompletedTxs = payload.filter(
        (v) => v.status >= DepositStatus.BlockConfirmed
      )
      if (l1CompletedTxs.length) {
        const completedHashes = l1CompletedTxs.map((v) => v.ethHash)
        state.ethHash = state.ethHash.filter(
          (v) => !completedHashes.includes(v.hash)
        )
      }

      const l2CompletedTxs = payload.filter(
        (v) => v.status >= DepositStatus.ZkLinkConfirmed
      )

      if (l2CompletedTxs.length) {
        const completedHashes = l2CompletedTxs.map((v) => v.ethHash)
        state.pendingTxs = state.pendingTxs.filter(
          (v) => !completedHashes.includes(v.tx.ethHash)
        )

        state.queryL2Hash = state.queryL2Hash.filter(
          (v) => !completedHashes.includes(v)
        )
      }
    })
    .addCase(updateQueryL2Hash, (state, { payload }) => {
      state.queryL2Hash = payload
    })
    .addCase(updateEthHash, (state, { payload }) => {
      state.ethHash = payload
    })
    .addCase(updateTxConfirmations, (state, { payload }) => {
      for (let i in payload) {
        const { txHash, confirmations } = payload[i]
        state.txConfirmations[txHash] = confirmations
      }
    })
    .addCase(updateDepositingAction, (state, { payload }) => {
      state.depositing = payload
    })
    .addCase(updateDepositTokenAction, (state, { payload }) => {
      state.selectedToken = payload
    })
    .addCase(updateDepositAmountAction, (state, { payload }) => {
      state.amount = payload
    })
})
