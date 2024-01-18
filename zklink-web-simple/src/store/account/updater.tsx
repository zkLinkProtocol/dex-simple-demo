import { useWeb3React } from '@web3-react/core'
import { ACCOUNT_INFO_POLLING_INTERVAL } from 'config'
import { useEffect } from 'react'
import { useAppDispatch } from 'store'
import { useAccountInfo, useIsInactivated } from 'store/account/hooks'
import { useInterval } from 'usehooks-ts'
import { getAccountBalanceAction, getAccountInfoAction } from './actions'

export default function Updater() {
  usePollingAccountInfo()
  usePollingAccountBalance()
  return null
}

function usePollingAccountInfo() {
  const { account = '' } = useWeb3React()
  const dispatch = useAppDispatch()
  const isInactivated = useIsInactivated()
  const polling = !!account && isInactivated === true
  useEffect(() => {
    if (!account) return
    dispatch(
      getAccountInfoAction({
        address: account,
      })
    )
  }, [account])
  useInterval(
    () => {
      if (!account) return
      dispatch(
        getAccountInfoAction({
          address: account,
        })
      )
    },
    polling ? ACCOUNT_INFO_POLLING_INTERVAL : null
  )
}

function usePollingAccountBalance() {
  const { id = 0 } = useAccountInfo()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!id) return
    dispatch(getAccountBalanceAction(id))
  }, [id])
  useInterval(
    () => {
      if (!id) return
      dispatch(getAccountBalanceAction(id))
    },
    id ? ACCOUNT_INFO_POLLING_INTERVAL : null
  )
}
