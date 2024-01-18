import {
  ApiHistoryItem,
  HistoryType,
  getHistoryListApi,
} from 'api/v1/txHistory'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store, useAppDispatch } from 'store'
import { useAccountId, useIsLogin } from 'store/account/hooks'
import { EthHashItem } from 'store/deposit/types'
import { useLinkConnected } from 'store/link/hooks'
import { useInterval } from 'usehooks-ts'
import { timer } from 'utils/timer'
import { HistoryTabType } from 'views/History/Tab'
import {
  getDepositHistoryAction,
  updateTransferList,
  updateTransferTotal,
  updateWithdrawList,
  updateWithdrawTotal,
} from './actions'

export function useHistoryTab() {
  return useSelector<RootState, HistoryTabType>(
    (state) => state.history.historyTab
  )
}
export function useDepositList() {
  return useSelector<RootState, ApiHistoryItem[]>(
    (state) => state.history.deposit.list
  )
}
export function useDepositEthHash() {
  return useSelector<RootState, EthHashItem[]>((state) => state.deposit.ethHash)
}
export function useWithdrawList() {
  return useSelector<RootState, ApiHistoryItem[]>(
    (state) => state.history.withdraw.list
  )
}
export function useWithdrawL2SuccessTxHash() {
  const withdrawList = useSelector<RootState, ApiHistoryItem[]>(
    (state) => state.history.withdraw.list
  )
  const useWithdrawL2Success = withdrawList?.filter(
    (item) => item?.txStatus === 'SUCCESS'
  )
  return useWithdrawL2Success?.map((item) => item?.txHash)
}
export function useWithdrawTxHash() {
  const withdrawList = useSelector<RootState, ApiHistoryItem[]>(
    (state) => state.history.withdraw.list
  )
  return withdrawList?.map((item) => item?.txHash)
}
export function useWithdrawTotal() {
  return useSelector<RootState, number>((state) => state.history.withdraw.total)
}
export function useDepositTotal() {
  return useSelector<RootState, number>((state) => state.history.deposit.total)
}
export function useTransferTotal() {
  return useSelector<RootState, number>((state) => state.history.transfer.total)
}
export function useTransferList() {
  return useSelector<RootState, ApiHistoryItem[]>(
    (state) => state.history.transfer.list
  )
}
export function requestTxWithdraw(currentPage: number, limit: number) {
  const accountId = store.getState().account.accountInfo?.id
  if (accountId === undefined) {
    return
  }
  getHistoryListApi({
    pageIndex: currentPage - 1,
    pageSize: limit,
    type: HistoryType.Withdraw,
    account: accountId!,
  }).then((res) => {
    if (res?.data?.results.length) {
      store.dispatch(updateWithdrawList(res?.data?.results))
      store.dispatch(updateWithdrawTotal(res?.data?.total))
    }
  })
}

export function useFetchWithdrawHistory(currentPage: number, limit: number) {
  const dispatch = useDispatch()
  const accountId = useAccountId()
  const isLogin = useIsLogin()
  const connected = useLinkConnected()
  const fetchWithdrawHistory = useCallback(() => {
    if (!isLogin) {
      return
    }
    requestTxWithdraw(currentPage, limit)
  }, [dispatch, isLogin, accountId])
  useEffect(() => {
    if (!connected) {
      return
    }
    return timer(fetchWithdrawHistory, 60000)
  }, [fetchWithdrawHistory, connected])

  return {
    fetchWithdrawHistory,
  }
}
export function requestTxTransfer(currentPage: number, limit: number) {
  const accountId = store.getState().account.accountInfo?.id
  if (accountId === undefined) {
    return
  }
  getHistoryListApi({
    pageIndex: currentPage - 1,
    pageSize: limit,
    type: HistoryType.Transfer,
    account: accountId!,
  }).then((res) => {
    if (res?.data?.results.length) {
      store.dispatch(updateTransferList(res?.data?.results))
      store.dispatch(updateTransferTotal(res?.data?.total))
    }
  })
}
export function useFetchTransferHistory(currentPage: number, limit: number) {
  const dispatch = useDispatch()
  const isLogin = useIsLogin()
  const connected = useLinkConnected()
  const fetchTransferHistory = useCallback(() => {
    if (!isLogin) {
      return
    }
    requestTxTransfer(currentPage, limit)
  }, [dispatch, isLogin, currentPage, limit])
  useEffect(() => {
    if (!connected) {
      return
    }
    return timer(fetchTransferHistory, 60000)
  }, [fetchTransferHistory, connected])

  return {
    fetchTransferHistory,
  }
}
export function useFetchDepositHistory(page: number, limit: number = 10) {
  const dispatch = useAppDispatch()
  const accountId = useAccountId()

  useEffect(() => {
    if (accountId === undefined) {
      return
    }
    dispatch(getDepositHistoryAction({ page, limit }))
  }, [accountId, page, limit])

  useInterval(
    () => {
      dispatch(getDepositHistoryAction({ page, limit }))
    },
    accountId !== undefined ? 1000 * 30 : null
  )
}
