import { styled } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import { ActionButton } from 'components/Buttons/ActionButton'
import { ConnectWalletButton } from 'components/Buttons/ConnectWallet'
import { Input } from 'components/InputAmount'
import ModalLink from 'components/ModalLink'
import toastify from 'components/Toastify'
import { SUB_ACCOUNT_ID } from 'config'
import { BigNumber } from 'ethers'
import { parseUnits } from 'ethers/lib/utils'
import i18n from 'i18n'
import { memo, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { updateModal } from 'store/app/actions'
import { useCurrentNetwork, useModal } from 'store/app/hooks'
import {
  updateDepositAmountAction,
  updateDepositingAction,
} from 'store/deposit/actions'
import {
  isDepositBlockedChain,
  sendDepositFromEthereum,
  useDeposit,
  useDepositAmount,
  useDepositToken,
  useDepositing,
  useIsDepositMobilePage,
} from 'store/deposit/hook'
import { updateViewInExplorerLink } from 'store/link/actions'
import {
  useEthereumTokenBalance,
  useEthereumTokenInfo,
  useLinkConnected,
} from 'store/link/hooks'
import {
  ContentWrap,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  Space16,
  Space24,
  Space4,
  Space8,
} from 'styles'
import { GaEventName, gaEvent } from 'utils/ga'
import { bn, toFixed } from 'utils/number'
import { isUSDStableCoins } from 'utils/tokens'
import { DepositAmount } from './DepositAmount'
import { DepositAssets } from './DepositAssets'
import { DepositNetwork } from './DepositNetwork'
import { DepositReceive } from './DepositReceive'

export const StyledInputAmount = styled(Input)`
  flex: 1;
  height: 100%;
  text-align: left;
  padding: 0 12px 0 0;
  outline: none !important;
  border-color: none !important;
  box-shadow: none !important;
  color: #1c1f27;
`
export const ActionTitle = styled('div')`
  font-size: 14px;
  line-height: 20px;
  color: #454e68;
`
export const Max = styled('div')`
  line-height: 24px;
  color: ${(props) => props.theme.color.text90};
  padding: 0 12px;
  cursor: pointer;
  background: ${(props) => props.theme.color.primary10};
  border-radius: 2px;
`
export const Available = styled('div')`
  display: flex;
  justify-content: space-between;
  text-align: right;
  font-size: 16px;
  line-height: 16px;
  span {
    color: #76809d;
  }
  b {
    color: #303648;
    font-weight: 500;
  }
`

export const DepositTip = styled('div')`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  color: #5a6689;
  span {
    color: #4c40e6;
  }
`

export const GrayBgContent = styled('div')`
  background: ${(props) => props.theme.color.bgLightGray};
  font-size: 12px;

  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 12px;
  strong {
  }
`
export const HeaderTip = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: ${(props) => props.theme.color.text70};
`
export const TokenRowInput = styled('div')`
  display: flex;
  align-items: center;
  height: 36px;
  line-height: 16px;
  padding: 0 12px;
  border: 1px solid ${(props) => props.theme.color.text10};
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 36px;
  }
`
const TokenInput = styled(TokenRowInput)`
  border: none;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.color.bg};
`
export const TokenRowInputEle = styled(TokenInput)`
  height: 48px;
  color: ${(props) => props.theme.color.text70};
  font-size: 14px;
  position: relative;
`
export const FeeWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => props.theme.color.text70};
`
export const SelectTokenAndNetworkWrap = styled(TokenRowInputEle)`
  justify-content: space-between;
  height: 64px;
  padding-left: 0;
  padding-right: 0;
  background: ${(props) => props.theme.color.bg};
`
const SubmitBtn = styled(FlexCenter)`
  /* shadow/sm */

  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  line-height: 16px;
  /* identical to box height, or 100% */

  /* Controls/primary-cta-layer-color/60 */

  height: 48px;
  cursor: pointer;
  background: ${(props) => props.theme.color.primary50};
  color: ${(props) => props.theme.color.primaryGreyGreen};
  border: 1px solid ${(props) => props.theme.color.primaryGreyGreen};
  span {
    margin-left: 4px;
  }
`
const FromTip = styled('div')`
  color: ${(props) => props.theme.color.text70};
`
const ConfirmOrderWrap = styled('div')`
  padding: 16px;
  color: ${(props) => props.theme.color.text70};
`
const ConfirmOrderTitle = styled(FlexCenter)`
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
`
const ConfirmOrderValue = styled(FlexCenter)`
  margin: 16px auto 40px;
  font-weight: 500;
  font-size: 32px;
  line-height: 20px;
  height: 32px;
  span {
    display: flex;
    height: 100%;
    font-size: 14px;
    line-height: 20px;
    align-items: flex-end;
  }
`
const ConfirmOrderList = styled(FlexColumn)`
  padding: 12px;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  margin-bottom: 16px;
  background: ${(props) => props.theme.color.bgLightGray};
`
const ConfirmOrderItem = styled(FlexBetween)`
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  padding: 8px 0;
  width: 100%;
  > div {
    width: 30%;

    &:nth-of-type(2) {
      width: 60%;
      word-wrap: break-word;
      text-align: right;
    }
  }
`

const ConfirmOrderTip = styled('div')`
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
  margin-bottom: 12px;
`

export const DepositSelectAssets = memo(() => {
  const depositing = useDepositing()
  const confirmOrder = useModal('confirmOrder')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const depositAmount = useDepositAmount()
  const modal = useModal('deposit')
  const deposit = useDeposit()
  const { account, isActive, provider, chainId } = useWeb3React()
  const isDepositMobilePage = useIsDepositMobilePage()
  const params = useParams<{ address: string }>()
  const currentNetwork = useCurrentNetwork()
  const depositToken = useDepositToken()
  const l1Balance = useEthereumTokenBalance(
    currentNetwork?.layerOneChainId,
    depositToken?.l2CurrencyId!
  )
  const { decimals = 0, address: tokenAddress = '' } =
    useEthereumTokenInfo(
      currentNetwork?.layerOneChainId,
      depositToken?.l2CurrencyId!
    ) ?? {}
  const isLinkConnected = useLinkConnected()

  const isEnoughBalance = useMemo(() => {
    if (!depositAmount) {
      return false
    }
    if (!decimals) {
      return false
    }
    if (!l1Balance) {
      return false
    }
    return bn(
      !depositAmount ? '0' : parseUnits(toFixed(depositAmount, 18), decimals)
    ).lte(l1Balance)
  }, [depositAmount, decimals, l1Balance])

  useEffect(() => {
    if (!modal) {
      dispatch(updateDepositAmountAction(''))
    }
  }, [modal])

  const sendDeposit = () => {
    if (!depositAmount) {
      toastify.warn(
        `${t('common-enter-amount', {
          defaultValue: 'Please enter the amount you want to withdraw.',
        })}`
      )
      return
    }
    if (!depositToken || !depositToken?.name) {
      toastify.warn(
        `${t('common-select-token', { defaultValue: 'Please select a token' })}`
      )
      return
    }

    const _amount: BigNumber = parseUnits(depositAmount, decimals)

    deposit({
      tokenSymbol: depositToken?.name,
      tokenId: depositToken?.id!,
      tokenAddress: tokenAddress!,
      amount: _amount,
      decimals,
    }).finally(() => {
      dispatch(updateDepositAmountAction(''))
    })
    gaEvent(GaEventName.request_deposit, {
      symbol: depositToken.name!,
    })
  }
  const renderButton = () => {
    if (!isActive) {
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

    if (isDepositBlockedChain(currentNetwork?.layerOneChainId)) {
      return (
        <ActionButton variant="contained" disabled={true} fullWidth={true}>
          {currentNetwork?.name} chain deposits temporarily disabled
        </ActionButton>
      )
    }

    let btnText = ''
    let isDeposit = false
    if (!currentNetwork?.layerOneChainId || !depositToken?.name) {
      btnText = `${i18n.t('deposit-select-token-network', {
        defaultValue: 'Select token and network',
      })}`
    } else if (!Number(depositAmount)) {
      btnText = `${i18n.t('deposit-enter-amount', {
        defaultValue: 'Enter amount to deposit',
      })}`
    } else if (depositing) {
      btnText = 'Depositing'
      isDeposit = true
    } else if (!isEnoughBalance) {
      btnText = `${i18n.t('swap-btn-insufficient', {
        defaultValue: 'Insufficient balance',
      })}`
    } else {
      btnText = `${i18n.t('deposit-title', {
        defaultValue: 'Deposit',
      })}`
      isDeposit = true
    }

    if (isDeposit) {
      return (
        <ActionButton
          loading={depositing}
          variant="contained"
          fullWidth={true}
          onClick={() => {
            sendDeposit()
          }}>
          {btnText}
        </ActionButton>
      )
    } else {
      return (
        <ActionButton variant="contained" fullWidth={true} disabled={true}>
          {btnText}
        </ActionButton>
      )
    }
  }
  return (
    <ContentWrap>
      <GrayBgContent>
        {isDepositMobilePage && (
          <>
            <FromTip>Deposit To</FromTip>
            <Space4 />
            <TokenRowInputEle
              style={{
                overflow: 'hidden',
                wordWrap: 'break-word',
                wordBreak: 'break-all',
                height: 'unset',
                padding: '12px',
                fontSize: '12px',
              }}>
              {params?.address}
            </TokenRowInputEle>
            <Space4 />
          </>
        )}
        <FromTip>Network</FromTip>
        <Space4 />
        <DepositNetwork />
        <Space8 />
        <FromTip>Token</FromTip>
        <Space4 />
        <DepositAssets />
      </GrayBgContent>
      <Space16 />
      <GrayBgContent>
        <FromTip>
          <strong>
            {i18n.t('deposit-from', {
              defaultValue: 'From',
            })}
          </strong>{' '}
          {i18n.t('deposit-metamask-wallet', {
            defaultValue: 'Metamask Wallet',
          })}
        </FromTip>
        <Space4 />
        <DepositAmount />
      </GrayBgContent>
      <Space16 />

      <DepositReceive />
      <Space24 />
      {renderButton()}
      <ModalLink
        width="400px"
        isIn={confirmOrder}
        header={i18n.t('deposit-confirm-order', {
          defaultValue: 'Confirm order',
        })}
        onClose={() => {
          dispatch(
            updateModal({
              modal: 'confirmOrder',
              open: false,
            })
          )
        }}>
        <ConfirmOrderWrap>
          <ConfirmOrderTitle>You will receive</ConfirmOrderTitle>
          <ConfirmOrderValue>
            {depositAmount} <span>{depositToken?.name}</span>
          </ConfirmOrderValue>
          <ConfirmOrderList>
            <ConfirmOrderItem>
              <div>Address</div>
              <div>{params?.address}</div>
            </ConfirmOrderItem>
            <ConfirmOrderItem>
              <div>Network</div>
              <div>{currentNetwork?.name}</div>
            </ConfirmOrderItem>
          </ConfirmOrderList>
          <ConfirmOrderList>
            <ConfirmOrderItem>
              <div>Coin</div>
              <div>{depositToken?.name}</div>
            </ConfirmOrderItem>
            <ConfirmOrderItem>
              <div>Amount</div>
              <div>
                {depositAmount} {depositToken?.name}
              </div>
            </ConfirmOrderItem>
          </ConfirmOrderList>

          <ConfirmOrderTip>
            Ensure that the address is correct and on the same network.
            Transactions cannot be cancelled.
          </ConfirmOrderTip>
          <ActionButton
            loading={depositing}
            variant="contained"
            fullWidth={true}
            onClick={async () => {
              try {
                if (depositing) {
                  return
                }
                if (!provider) {
                  throw new Error('Invalid provider object')
                }
                if (!currentNetwork?.mainContract) {
                  throw new Error('Missing main contract address')
                }
                if (!tokenAddress) {
                  throw new Error('Missing token address')
                }
                if (!params?.address) {
                  throw new Error('Missing receiver address')
                }
                if (!account) {
                  throw new Error('Missing from address')
                }
                if (!chainId) {
                  throw new Error(`Unknown chainId ${chainId}`)
                }
                dispatch(updateDepositingAction(true))
                const _amount = parseUnits(depositAmount, decimals)
                const transactionResponse = await sendDepositFromEthereum(
                  provider,
                  {
                    chainId,
                    from: account,
                    subAccountId: SUB_ACCOUNT_ID,
                    depositTo: params?.address,
                    token: tokenAddress,
                    amount: _amount,
                    mapping: isUSDStableCoins(depositToken?.id!),
                  }
                ).catch((e) => {
                  throw new Error(e?.message)
                })
                const { hash } = transactionResponse
                const explorerUrl = `${currentNetwork.explorerUrl}/tx/${hash}`
                if (hash) {
                  dispatch(
                    updateViewInExplorerLink({
                      url: explorerUrl,
                    })
                  )
                  toastify.success({
                    title: 'Success',
                    message: 'Transaction sent successfully',
                    explorer: explorerUrl,
                  })

                  dispatch(
                    updateModal({
                      modal: 'confirmOrder',
                      open: false,
                    })
                  )
                }
              } catch (e) {
                toastify.error(e?.message)
              }
              dispatch(updateDepositingAction(false))
            }}>
            {i18n.t('cancel-modal-confirm-btn', { defaultValue: 'Confirm' })}
          </ActionButton>
        </ConfirmOrderWrap>
      </ModalLink>
    </ContentWrap>
  )
})
