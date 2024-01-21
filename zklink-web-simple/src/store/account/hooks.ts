import { AccountInfo, getAccountNonce } from 'api/v3/account'
import { sendTransaction } from 'api/v3/sendTransaction'
import toastify from 'components/Toastify'
import { SUB_ACCOUNT_ID } from 'config'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState, store, useAppDispatch } from 'store'
import { updateModal } from 'store/app/actions'
import {
  findNetworks,
  useChangePubKeyChainId,
  useCurrentNetwork,
  useIsErrorChain,
} from 'store/app/hooks'
import { updateAccountLockState } from 'store/link/actions'
import { useLinkConnected, useLinkWallet } from 'store/link/hooks'
import { TokenSymbol } from 'types'
import { isZeroAddress } from 'utils/address'
import { signChangePubKey } from 'utils/signer/transactions/changePubKey'
import { sleep } from 'utils/sleep'
import { updateWithdrawing } from '../withdraw/actions'
import { getAccountInfoAction, updateAccountActivatingAction } from './actions'
import { AccountStatus, AccountTickets, CurrencyBalance } from './reducer'

export function useAccountInfo() {
  const accountInfo = useSelector<RootState, AccountInfo | null>(
    (state) => state.account.accountInfo
  )
  return useMemo(() => {
    return accountInfo ?? ({} as Partial<AccountInfo>)
  }, [accountInfo])
}
export function useAccountId() {
  const { id = 0 } = useAccountInfo() ?? {}
  return id
}
export function useL2AccountId() {
  const { id = 0 } = useAccountInfo() ?? {}
  return id
}
export function useActivateStatus() {
  return useSelector<RootState, AccountStatus>(
    (state) => state.account.accountStatus
  )
}
export function useIsInactivated() {
  const status = useActivateStatus()
  return status !== AccountStatus.Activated
}
export function useIsActivated() {
  const status = useActivateStatus()
  return status === AccountStatus.Activated
}
export function useActivating() {
  const activating = useSelector<RootState, boolean>(
    (state) => state.account.activating
  )
  return activating
}
export function useAccountBalances() {
  return useSelector<RootState, CurrencyBalance[]>(
    (state) => state.account.balances
  )
}
export function useCurrencyBalance(symbol: TokenSymbol) {
  const balances = useAccountBalances()
  return balances.find((v) => v.currency === symbol)
}
export function useAccountTickets() {
  return useSelector<RootState, AccountTickets | undefined>(
    (state) => state.account.tickets
  )
}

export function useActivateAccount() {
  const signer = useLinkWallet()
  const currentNetwork = useCurrentNetwork()
  const isErrorChain = useIsErrorChain()
  const dispatch = useAppDispatch()
  const changePubKeyChainId = useChangePubKeyChainId()

  return useCallback(
    async function activateAccount() {
      try {
        if (!signer) {
          throw new Error('wallet is undefined')
        }
        // if (isErrorChain) {
        //   throw new Error('Must be activated on our supported network.')
        // }
        const {
          layerTwoChainId = 0,
          layerOneChainId = 0,
          mainContract = '',
        } = findNetworks({ layerTwoChainId: changePubKeyChainId }) ?? {}
        dispatch(updateAccountActivatingAction(true))
        const state = store.getState()
        const { tokens } = state.app
        const { id = 0, address = '' } = state.account.accountInfo || {}
        const balance = state.account.balances.find(
          (v) => !!tokens.find((token) => token.id === v.currencyId)
        )

        if (!balance) {
          throw new Error('activateAccount: balance is undefined')
        }
        const token = tokens.find((v) => v.id === balance.currencyId)

        if (!token?.l2CurrencyId) {
          throw new Error('activateAccount: fee token is undefined')
        }
        if (!layerOneChainId) {
          throw new Error(
            `activateAccount: invalid layer one chain id, ${layerOneChainId}`
          )
        }
        if (!mainContract) {
          throw new Error(
            `activateAccount: invalid contract address, ${mainContract}`
          )
        }
        if (!id) {
          throw new Error(`activateAccount: invalid layer2 account id, ${id}`)
        }
        dispatch(updateWithdrawing(true))

        const nonce = await getAccountNonce(address, 1)

        const signedData = await signChangePubKey(signer, {
          accountId: id, // from getAccount, result.id
          subAccountId: SUB_ACCOUNT_ID, // must 0
          chainId: layerTwoChainId, // from getChangePubkeyChainId specify
          ethAuthType: 'EthECDSA',
          feeTokenId: token.l2CurrencyId, // from getAccountBalances
          fee: '0',
          nonce: nonce, // from getAccount, result.nonce
        })

        const { tx, layer1_signature } = signedData

        const txHash = await sendTransaction(tx, layer1_signature)
        console.log(txHash)
        const isSigningKeySet = await waitActivateAccount()

        dispatch(updateAccountLockState({ isLocked: !isSigningKeySet }))
        dispatch(updateModal({ modal: 'guide', open: false }))
        return { isActivate: true }
      } catch (e: any) {
        toastify.error(e?.message ?? e?.msg)
        console.error(e)
        return { isActivate: false }
      } finally {
        dispatch(updateWithdrawing(false))
        dispatch(updateAccountActivatingAction(false))
        dispatch(updateModal({ modal: 'verify', open: false }))
      }
    },
    [signer, currentNetwork, changePubKeyChainId, isErrorChain]
  )
}

export async function waitActivateAccount() {
  const state = store.getState()
  const { address = '' } = state.account.accountInfo ?? {}

  if (!address) {
    throw new Error('Missing address to requests account info')
  }
  while (
    isZeroAddress(
      (
        (
          await store.dispatch(
            getAccountInfoAction({
              address,
            })
          )
        ).payload as AccountInfo
      ).pubKeyHash
    )
  ) {
    await sleep(2000)
  }
  return true
}

export function useIsLogin() {
  const isLogin = useLinkConnected()
  return !!isLogin
}
export function useUserToken() {
  return useSelector<RootState, string>((state) => state.account.token)
}

export async function waitTransaction(txId: any) {
  let data: any
  do {
    data = {} //await getTransaction(txId)
    if (data?.txStatus !== 'SUCCESS' && data?.txStatus !== 'FAILED') {
      await sleep(2000)
    }
  } while (data?.txStatus !== 'SUCCESS' && data?.txStatus !== 'FAILED')

  return data
}
