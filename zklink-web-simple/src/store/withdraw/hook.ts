import { AddressBookRow } from 'api/v1/addressBook'
import { getAccountNonce } from 'api/v3/account'
import { getBrokerPrice } from 'api/v3/broker'
import { sendTransaction } from 'api/v3/sendTransaction'
import { Currency } from 'api/v3/tokens'
import toastify from 'components/Toastify'
import { SUB_ACCOUNT_ID } from 'config'
import { BigNumber } from 'ethers'
import i18n from 'i18n'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store } from 'store'
import { useAccountInfo } from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import { findCurrencyById } from 'store/app/hooks'
import { useLinkWallet } from 'store/link/hooks'
import {
  Address,
  Ether,
  L1ChainId,
  L2ChainId,
  TokenId,
  TokenSymbol,
  Wei,
} from 'types'
import { zklinkExplorerUrl } from 'utils/explorer'
import { bn, e2w, toFixed, w2e } from 'utils/number'
import {
  SignWithdrawPayload,
  signWithdraw,
} from 'utils/signer/transactions/withdraw'
import { sdk } from 'utils/signer/utils'
import { isUSD } from 'utils/tokens'
import { TransactionType, getTransactionFees } from 'utils/transactionFees'
import { getGatewayScheduling } from '../../api/v3/scheduling'
import { findNetworks, useSpotCurrencies } from '../app/hooks'
import { updateWithdrawing } from './actions'
import { WithdrawLayoutType, WithdrawState, WithdrawStatus } from './types'

export function useWithdrawLayoutType() {
  return useSelector<RootState, WithdrawLayoutType>(
    (state) => state.withdraw.layoutType
  )
}
export function useTitleName() {
  return useSelector<RootState, string>((state) => state.withdraw.titleName)
}

export function useShowAddressBookList() {
  return useSelector<RootState, boolean>(
    (state) => state.withdraw.showAddressBookList
  )
}
export function useIsFocus() {
  return useSelector<RootState, boolean>((state) => state.withdraw.isFocus)
}
export function useShowAddAddress() {
  return useSelector<RootState, boolean>(
    (state) => state.withdraw.showAddAddress
  )
}
export function useIsUseAddressBook() {
  return useSelector<RootState, boolean>(
    (state) => state.withdraw.isUseAddressBook
  )
}
export function useAddOrEditAddress() {
  return useSelector<RootState, string>(
    (state) => state.withdraw.addOrEditAddress
  )
}

export function useAmount() {
  return useSelector<RootState, Ether>((state) => state.withdraw.amount)
}
export function useAddressBookList() {
  return useSelector<RootState, AddressBookRow[]>(
    (state) => state.withdraw.addressBookList
  )
}
export function useCurrentEditAddressBook() {
  return useSelector<RootState, AddressBookRow | undefined>(
    (state) => state.withdraw.currentEditAddressBook
  )
}
export function useCurrentUseAddressBook() {
  return useSelector<RootState, AddressBookRow | undefined>(
    (state) => state.withdraw.currentUseAddressBook
  )
}
export function useIsAddOrEditAddressBook() {
  return useSelector<RootState, number | undefined>(
    (state) => state.withdraw.isAddOrEditAddressBook
  )
}
export function useWithdrawAddress() {
  return useSelector<RootState, string>((state) => state.withdraw.address)
}

export function useSelectedToken() {
  return useSelector<RootState, Currency | undefined>(
    (state) => state.withdraw.selectedToken
  )
}

export function useSelectFast() {
  return useSelector<RootState, boolean>((state) => state.withdraw.selectFast)
}
export function useWithdrawStatus(txHash: string) {
  return useSelector<RootState, WithdrawStatus>(
    (state) => state.withdraw.withdrawStatus[txHash]
  )
}

export function useWithdrawing() {
  return useSelector<RootState, boolean>((state) => state.withdraw.withdrawing)
}
export function useWithdrawLimit() {
  return useSelector<RootState, WithdrawState['withdrawLimit']>(
    (state) => state.withdraw.withdrawLimit
  )
}
export function useWithdrawLimitByToken(
  tokenId: TokenId
): [Record<L2ChainId, Wei>, boolean] {
  const limit = useWithdrawLimit()

  return useMemo(() => {
    try {
      if (!tokenId) {
        throw new Error(`Unknown tokenId, tokenId: ${tokenId}`)
      }
      if (limit[tokenId] === undefined) {
        throw new Error(`Limit size is undefined`)
      }

      return [limit[tokenId], limit.pending]
    } catch (e) {
      console.warn(e?.message)
      return [{}, limit.pending]
    }
  }, [limit, tokenId])
}

export function useWithdrawFee(
  chainId: L1ChainId,
  tokenId: TokenId
): [BigNumber | undefined, boolean] {
  const [fee, setFee] = useState<BigNumber>()
  const [pending, setPending] = useState<boolean>(false)
  useEffect(() => {
    if (!tokenId || !chainId) {
      return
    }
    setFee(undefined)
    setPending(true)
    try {
      const fee = getTransactionFees(TransactionType.Withdraw, chainId, tokenId)
      setFee(bn(sdk.closestPackableTransactionFee(fee.toString())))
    } catch (e) {
      toastify.error(e.message)
      console.error(e)
    } finally {
      setPending(false)
    }
  }, [chainId, tokenId])

  return [fee, pending]
}

export function useWithdraw() {
  const signer = useLinkWallet()
  const dispatch = useDispatch()
  const accountInfo = useAccountInfo()
  return useCallback(
    async function withdraw({
      withdrawTo,
      tokenId,
      tokenSymbol,
      amount,
      layerOneChainId,
      fee,
      withdrawFeeRatio,
      fastWithdraw,
    }: {
      withdrawTo: Address
      tokenId: TokenId
      tokenSymbol: TokenSymbol
      amount: BigNumber
      layerOneChainId: L1ChainId
      fee: BigNumber
      withdrawFeeRatio: number
      fastWithdraw: 0 | 1
    }) {
      try {
        if (!signer) {
          return
        }
        dispatch(updateWithdrawing(true))

        const currentNetwork = findNetworks({
          layerOneChainId: layerOneChainId,
        })
        const currentToken = findCurrencyById({
          l2Id: tokenId,
        })

        if (!currentNetwork) {
          throw new Error(`Unknown network layer1 chain id: ${layerOneChainId}`)
        }

        let { gateway } = currentNetwork

        let toChainId = currentNetwork.layerTwoChainId
        let withdrawToL1: 0 | 1 = 0
        // Withdraw to Ethereum requires fetching the preferred gateway from the gateway scheduling system.
        if (gateway) {
          const priorityGateway = await getGatewayScheduling(
            store.getState().app.ethProperty.gateways
          )

          if (!priorityGateway) {
            throw new Error(`No available gateway found`)
          }

          toChainId = priorityGateway.chainId
          withdrawToL1 = 1
        }

        if (!toChainId) {
          throw new Error(`Unknown network layer2 chain id: ${toChainId}`)
        }

        const tokenDecimals = currentToken?.chains[toChainId]?.decimals ?? 0
        amount = e2w(toFixed(w2e(amount), tokenDecimals))

        const tokenAmount = sdk.closestPackableTransactionAmount(
          amount.toString()
        )

        const { id = 0, address = '' } = accountInfo
        const nonce = await getAccountNonce(address, 2)

        const payload: SignWithdrawPayload = {
          accountId: id,
          toChainId: toChainId,
          subAccountId: SUB_ACCOUNT_ID,
          to: address,
          l2SourceTokenId: tokenId,
          l2SourceTokenSymbol: tokenSymbol,
          l1TargetTokenId: tokenId,
          amount: tokenAmount,
          tokenDecimals,
          fee: fee.toString(),
          withdrawFeeRatio: fastWithdraw ? withdrawFeeRatio : 0,
          withdrawToL1: !!withdrawToL1,
          nonce: nonce,
        }

        const signedData = await signWithdraw(signer, payload)

        const { tx, layer1_signature } = signedData

        const { result } = await sendTransaction(tx, layer1_signature)

        console.log(result)

        toastify.success(
          {
            message: i18n.t('common-withdraw-submitted', {
              defaultValue: 'Withdraw submitted',
            }),
            explorer: zklinkExplorerUrl(result),
          },
          { autoClose: 3000 }
        )

        dispatch(updateModal({ modal: 'withdraw', open: false }))

        return Promise.resolve()
      } catch (e) {
        console.error(e)
        toastify.error(e.message)
        return Promise.reject()
      } finally {
        dispatch(updateWithdrawing(false))
      }
    },
    [signer, accountInfo]
  )
}
export function useWithdrawCurrencies(l2ChainId?: L2ChainId) {
  const currencies = useSpotCurrencies(l2ChainId)
  return useMemo(() => {
    return currencies.filter((v) => !isUSD(v.id))
  }, [currencies])
}

export function useBrokerLimit(chainId: L1ChainId, tokenId: TokenId) {
  const [brokerInfo, setBrokerInfo] = useState<{
    available: Wei
    fee: number // 50 /10000,
    limit: Wei
  } | null>(null)
  useEffect(() => {
    if (!chainId || !tokenId) {
      setBrokerInfo(null)
      return
    }
    getBrokerPrice(chainId, tokenId)
      .then((r) => {
        setBrokerInfo(r)
      })
      .catch((e) => {
        console.error(e)
      })
  }, [chainId, tokenId])
  return brokerInfo
}

export function useWithdrawalTransactions() {
  return useSelector<RootState, WithdrawState['transactions']>(
    (state) => state.withdraw.transactions
  )
}
