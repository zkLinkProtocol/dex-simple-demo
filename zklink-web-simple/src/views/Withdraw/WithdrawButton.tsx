import { Button, Stack, styled } from '@mui/material'
import { ChainInfo } from 'api/v3/chains'
import { ActionButton } from 'components/Buttons/ActionButton'
import { ConnectWalletButton } from 'components/Buttons/ConnectWallet'
import { InsufficientBalanceButton } from 'components/Buttons/InsufficientBalance'
import { OpenMyAccountButton } from 'components/Buttons/OpenMyAccount'
import Loading from 'components/Loading'
import { BigNumber } from 'ethers'
import useIsEnoughBalance from 'hooks/useIsEnoughBalance'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useL2AccountId } from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import { useAddress, useWeb3Connected } from 'store/app/hooks'
import { useLinkConnected } from 'store/link/hooks'
import {
  useAmount,
  useSelectFast,
  useSelectedToken,
  useWithdrawAddress,
  useWithdrawLayoutType,
  useWithdrawLimitByToken,
  useWithdrawing,
} from 'store/withdraw/hook'
import { WithdrawLayoutType } from 'store/withdraw/types'
import { Wing10 } from 'styles'
import { Wei } from 'types'
import {
  e2w,
  parseEtherToWei,
  parseWeiToEther,
  toFixed,
  w2e,
} from 'utils/number'

const WithdrawButton = styled(Button)``
const FastErrorTips = styled('div')`
  text-align: center;
  font-size: 12px;
  padding: 4px 0;
  color: ${(props) => props.theme.color.notificationRed02};
`

const WithdrawBtn: FC<{
  l2Balance: string
  fee: BigNumber | undefined
  sendWithdraw: () => Promise<void>
  selectedNetwork?: ChainInfo
  brokerLimit?: Wei
}> = memo(({ l2Balance, fee, sendWithdraw, brokerLimit, selectedNetwork }) => {
  const selectedToken = useSelectedToken()
  const dispatch = useDispatch()
  const amount = useAmount()
  const accountId = useL2AccountId()
  const web3Connected = useWeb3Connected()
  const isLinkConnected = useLinkConnected()
  const isEnoughBalance = useIsEnoughBalance(
    !amount ? '0' : amount,
    l2Balance || '0'
  )
  const withdrawing = useWithdrawing()
  const myAddress = useAddress()
  const { t } = useTranslation()
  const layoutType = useWithdrawLayoutType()
  const address = useWithdrawAddress()
  const selectFast = useSelectFast()

  const [limitSize] = useWithdrawLimitByToken(selectedToken?.l2CurrencyId!)

  const limit = selectedNetwork?.layerTwoChainId
    ? limitSize[selectedNetwork?.layerTwoChainId] ?? '0'
    : '0'

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
    /*if (isInactivated) {
      return <ActivateAccountButton />
    }*/
    if (isEnoughBalance == false) {
      return <InsufficientBalanceButton />
    }

    if (selectFast) {
      if (brokerLimit === undefined) {
        return (
          <WithdrawButton
            disabled={true}
            fullWidth={true}
            variant={'contained'}>
            Acceptor info initialization failed. Please wait or refresh to
            retry.
          </WithdrawButton>
        )
      }
      if (e2w(amount).gt(brokerLimit)) {
        const availableString =
          toFixed(w2e(brokerLimit), 0) + selectedToken?.name
        return (
          <Stack>
            <WithdrawButton
              disabled={true}
              fullWidth={true}
              variant={'contained'}>
              Temporary Fast Withdrawal Limit: {availableString}
            </WithdrawButton>
            <FastErrorTips>
              Due to provider limits, fast withdrawals are currently capped at{' '}
              {availableString}.<br />
              Please select standard withdrawal or reduce the amount.
            </FastErrorTips>
          </Stack>
        )
      }
    }
    const isDisabled =
      !Number(amount) ||
      !selectedToken?.name ||
      !fee ||
      !address ||
      withdrawing ||
      +amount > +parseWeiToEther(l2Balance)

    if (layoutType === WithdrawLayoutType.Withdraw) {
      // return (
      //   <WithdrawButton disabled={true} fullWidth={true} variant={'contained'}>
      //     Withdrawal is not enabled on Testnet3.0
      //   </WithdrawButton>
      // )
      if (limit === undefined || parseEtherToWei(amount).gt(limit)) {
        return (
          <WithdrawButton
            disabled={true}
            fullWidth={true}
            variant={'contained'}>
            {t('withdrawal-exeeds-limit', {
              defaultValue: 'Exceeds withdrawal limit',
            })}
          </WithdrawButton>
        )
      }
    }

    if (layoutType === WithdrawLayoutType.Transfer) {
      if (address === myAddress) {
        return (
          <WithdrawButton
            disabled={true}
            fullWidth={true}
            variant={'contained'}>
            {t('withdrawal-different-address', {
              defaultValue: 'Please use a different wallet address',
            })}
          </WithdrawButton>
        )
      }
    }

    return (
      <WithdrawButton
        disabled={isDisabled}
        fullWidth={true}
        variant={'contained'}
        onClick={sendWithdraw}>
        {withdrawing ? <Loading /> : null}
        <Wing10>
          {withdrawing
            ? 'Withdrawing'
            : t('home-account-withdraw', { defaultValue: 'Withdraw' })}
        </Wing10>
      </WithdrawButton>
    )
  }
  return <>{renderButton()}</>
})
export default WithdrawBtn
