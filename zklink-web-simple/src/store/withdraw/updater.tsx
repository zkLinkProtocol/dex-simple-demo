import { HistoryStatusType } from 'api/v1/txHistory'
import { ExplorerTxnStatus, getBatchTxnDetail } from 'api/v3/explorer'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { store } from 'store'
import {
  useWithdrawL2SuccessTxHash,
  useWithdrawList,
} from 'store/history/hooks'
import { useInterval } from 'usehooks-ts'
import { updateWithdrawStatus } from './actions'
import { WithdrawStatus } from './types'

async function fetchBatchTxnDetail(hashList: string[]) {
  getBatchTxnDetail(hashList).then((res) => {
    const { result = [] } = res ?? {}
    if (result?.length) {
      result.forEach((item) => {
        if (item.status === ExplorerTxnStatus.L1Completed) {
          store.dispatch(
            updateWithdrawStatus({
              txHash: item.txnHash,
              status: WithdrawStatus.Success,
            })
          )
        } else {
          if (item?.extend?.broker_hash) {
            store.dispatch(
              updateWithdrawStatus({
                txHash: item.txnHash,
                status: WithdrawStatus.Success,
              })
            )
          } else {
            store.dispatch(
              updateWithdrawStatus({
                txHash: item.txnHash,
                status: WithdrawStatus.Processing,
              })
            )
          }
        }
      })
    }
  })
}

export default function Updater() {
  const dispatch = useDispatch()
  const withdrawList = useWithdrawList()
  const withdrawL2SuccessTxHash = useWithdrawL2SuccessTxHash()

  useEffect(() => {
    if (!withdrawList.length) return

    withdrawList.forEach((item) => {
      if (item.txStatus === HistoryStatusType.fail) {
        dispatch(
          updateWithdrawStatus({
            txHash: item.txHash,
            status: WithdrawStatus.Fail,
          })
        )
      } else {
        dispatch(
          updateWithdrawStatus({
            txHash: item.txHash,
            status: WithdrawStatus.Processing,
          })
        )
      }
    })
  }, [withdrawList])

  useEffect(() => {
    if (!withdrawL2SuccessTxHash.length) return
    fetchBatchTxnDetail(withdrawL2SuccessTxHash)
  }, [withdrawL2SuccessTxHash])

  useInterval(
    () => {
      if (!withdrawL2SuccessTxHash?.length) return
      fetchBatchTxnDetail(withdrawL2SuccessTxHash)
    },
    withdrawL2SuccessTxHash.length ? 60000 : null
  )

  return null
}
