import { postTransfer } from 'api/v1/transfer'
import { getAccountNonce } from 'api/v3/account'
import toastify from 'components/Toastify'
import { SUB_ACCOUNT_ID } from 'config'
import { BigNumber } from 'ethers'
import i18n from 'i18n'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAccountInfo } from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import { useLinkWallet } from 'store/link/hooks'
import { updateWithdrawing } from 'store/withdraw/actions'
import { Address, TokenId, TokenSymbol } from 'types'
import { zklinkExplorerUrl } from 'utils/explorer'
import { signTransfer } from 'utils/signer/transactions/transfer'
import { sdk } from 'utils/signer/utils'

export function useTransferFee({
  address,
  currency,
}: {
  address: Address
  currency: string
}): [BigNumber | undefined, boolean] {
  const [fee, setFee] = useState<BigNumber>()
  const [pending, setPending] = useState<boolean>(false)

  useEffect(() => {
    if (!address || !currency) {
      return
    }
    setFee(undefined)
  }, [address, currency])

  return [fee, pending]
}

export function useTransfer() {
  const signer = useLinkWallet()
  const dispatch = useDispatch()
  const accountInfo = useAccountInfo()
  return useCallback(
    async function transfer({
      toAddress,
      tokenId,
      tokenSymbol,
      amount,
    }: {
      toAddress: Address
      tokenId: TokenId
      tokenSymbol: TokenSymbol
      amount: BigNumber
      fee: BigNumber
    }) {
      try {
        if (!signer) {
          return
        }
        dispatch(updateWithdrawing(true))
        const { id = 0, address: fromAddress = '' } = accountInfo

        const nonce = await getAccountNonce(fromAddress, 2)
        const tokenAmount = sdk.closestPackableTransactionAmount(
          amount.toString()
        )
        const signedData = await signTransfer(signer, {
          accountId: id,
          to: toAddress,
          fromSubAccountId: SUB_ACCOUNT_ID,
          toSubAccountId: SUB_ACCOUNT_ID,
          tokenId: tokenId,
          tokenSymbol: tokenSymbol,
          amount: tokenAmount,
          fee: '0',
          nonce,
        })

        const { tx, layer1_signature } = signedData

        const rpcResponse = await postTransfer(tx, layer1_signature).catch(
          (e) => {
            throw e
          }
        )

        toastify.success(
          {
            message: i18n.t('common-withdraw-submitted', {
              defaultValue: 'Withdraw submitted',
            }),
            explorer: zklinkExplorerUrl(rpcResponse.data.txHash),
          },
          { autoClose: 3000 }
        )

        dispatch(updateModal({ modal: 'withdraw', open: false }))
      } catch (e) {
        console.error(e)
        toastify.error(e.message)
      } finally {
        dispatch(updateWithdrawing(false))
      }
    },
    [signer, accountInfo]
  )
}
