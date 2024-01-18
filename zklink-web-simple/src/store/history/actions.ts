import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  ApiHistoryItem,
  HistoryType,
  getHistoryListApi,
} from 'api/v1/txHistory'
import { RootState } from 'store'
import { updateDepositStatus } from 'store/deposit/actions'
import { DepositStatus } from 'store/deposit/types'
import { HistoryTabType } from 'views/History/Tab'

export const updateHistoryTabAction = createAction<{ tab: HistoryTabType }>(
  'history/updateHistoryTabAction'
)

export const updateWithdrawList = createAction<ApiHistoryItem[]>(
  'history/updateWithdrawList'
)
export const updateTransferList = createAction<ApiHistoryItem[]>(
  'history/updateTransferList'
)
export const clearHistoryAction = createAction('history/clearHistoryAction')
export const updateWithdrawTotal = createAction<number>(
  'history/updateWithdrawTotal'
)
export const updateTransferTotal = createAction<number>(
  'history/updateTransferTotal'
)

export const getDepositHistoryAction = createAsyncThunk<
  | {
      list: ApiHistoryItem[]
      total: number
    }
  | undefined,
  {
    page: number
    limit: number | undefined
  },
  {
    state: RootState
  }
>(
  'history/getDepositHistoryAction',
  async ({ page, limit }, { getState, dispatch }) => {
    limit = limit ?? 10
    const state = getState()
    const accountId = state.account.accountInfo?.id
    if (accountId === undefined) {
      return
    }
    const { results = [], total = 0 } =
      (await getHistoryListApi({
        pageIndex: page,
        pageSize: limit || 10,
        type: HistoryType.Deposit,
        account: accountId!,
      }).then((r) => r.data)) ?? {}

    // The Nexus records always succeed, so we can update the status here.
    const batchStatus = results.map((item) => ({
      ethHash: item.ethHash!, // ethHash is existed in deposit history
      status: DepositStatus.ZkLinkConfirmed,
    }))
    dispatch(updateDepositStatus(batchStatus))

    return {
      list: results,
      total,
    }
  }
)
