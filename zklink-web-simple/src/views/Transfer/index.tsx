import { Button, InputBase, styled } from '@mui/material'
import { ActionButton } from 'components/Buttons/ActionButton'
import { ConnectWalletButton } from 'components/Buttons/ConnectWallet'
import { OpenMyAccountButton } from 'components/Buttons/OpenMyAccount'
import Loading from 'components/Loading'
import toastify from 'components/Toastify'
import { isAddress } from 'ethers/lib/utils'
import { ChangeEvent, memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import {
  useActivateAccount,
  useActivating,
  useIsInactivated,
  useL2AccountId,
} from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import { useSpotCurrencies, useWeb3Connected } from 'store/app/hooks'
import { useLinkConnected } from 'store/link/hooks'
import { useTransfer } from 'store/transfer/hooks'
import { useWithdrawing } from 'store/withdraw/hook'
import { ContentWrap, Space16, Space4, Space8, Wing10 } from 'styles'
import { bn, e2w } from 'utils/number'
import { GrayBgContent, TokenRowInputEle } from 'views/Deposit/DepositContent'
import { MainWrap } from 'views/Main/styles'
import { FromTip, WithdrawSelectWrap } from 'views/Withdraw/style'

const StyledInput = styled(InputBase)`
  flex: 1;
`

export const Transfer = memo(() => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [address, setAddress] = useState<string>('')
  const [tokenSymbol, setTokenSymbol] = useState<string>('')
  const [amount, setAmount] = useState<string>('')
  const isInactivated = useIsInactivated()
  const activateAccount = useActivateAccount()
  const activating = useActivating()
  const transfer = useTransfer()
  const withdrawing = useWithdrawing()
  const web3Connected = useWeb3Connected()
  const isLinkConnected = useLinkConnected()
  const accountId = useL2AccountId()

  const tokens = useSpotCurrencies()

  const onSubmit = async () => {
    console.log(address)
    console.log(tokenSymbol)
    console.log(amount)

    if (!address) {
      toastify.warn('Please input address')
      return
    }
    if (!isAddress(address)) {
      toastify.warn('Invalid address')
      return
    }
    if (!tokenSymbol) {
      toastify.warn('Please input token symbol')
      return
    }
    if (!amount) {
      toastify.warn('Please input amount')
      return
    }

    const token = tokens.find((v) => v.l2Symbol === tokenSymbol)
    if (!token) {
      toastify.warn('Token not found')
      return
    }

    const submitTransfer = async () => {
      const r = await transfer({
        toAddress: address,
        tokenSymbol,
        tokenId: token.l2CurrencyId,
        amount: e2w(amount),
        fee: bn(0),
      })
    }

    if (isInactivated && !activating) {
      const activeStatus = await activateAccount()
      const { isActivate } = activeStatus
      if (isActivate) {
        submitTransfer()
      }
      return
    }

    submitTransfer()
  }

  const renderButton = () => {
    if (!web3Connected) {
      return <ConnectWalletButton />
    }
    if (!isLinkConnected) {
      return (
        <ActionButton
          variant="contained"
          fullWidth={true}
          onClick={() => {
            dispatch(updateModal({ modal: 'verify', open: true }))
          }}>
          Connect zkLink
        </ActionButton>
      )
    }
    if (!accountId) {
      return <OpenMyAccountButton />
    }
    return (
      <Button
        disabled={false}
        fullWidth
        variant={'contained'}
        onClick={onSubmit}>
        {withdrawing ? <Loading /> : null}
        <Wing10>{withdrawing ? 'Pending' : 'Transfer'}</Wing10>
      </Button>
    )
  }
  return (
    <MainWrap>
      <ContentWrap>
        <WithdrawSelectWrap>
          <GrayBgContent>
            <FromTip>To Address</FromTip>
            <Space4 />
            <TokenRowInputEle>
              <StyledInput
                placeholder="Recipient's address"
                value={address}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setAddress(event.currentTarget.value as string)
                }}
              />
            </TokenRowInputEle>
          </GrayBgContent>
          <Space8 />
          <GrayBgContent>
            <FromTip>Token Symbol</FromTip>
            <Space4 />
            <TokenRowInputEle>
              <StyledInput
                placeholder="E.g. wETH"
                value={tokenSymbol}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setTokenSymbol(event.currentTarget.value as string)
                }}
              />
            </TokenRowInputEle>
          </GrayBgContent>
          <Space8 />
          <GrayBgContent>
            <FromTip>Amount</FromTip>
            <Space4 />
            <TokenRowInputEle>
              <StyledInput
                placeholder="E.g. 1.23"
                value={amount}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setAmount(event.currentTarget.value as string)
                }}
              />
            </TokenRowInputEle>
          </GrayBgContent>
          <Space16 />
          {renderButton()}
        </WithdrawSelectWrap>
      </ContentWrap>
    </MainWrap>
  )
})
