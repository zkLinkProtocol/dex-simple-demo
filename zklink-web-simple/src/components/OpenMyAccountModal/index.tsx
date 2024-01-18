import { Button, Stack, styled, Tooltip } from '@mui/material'
// import { DepositSelectAssets } from 'views/Deposit/DepositSelectAssets'
import { ActionButton } from 'components/Buttons/ActionButton'
import Iconfont from 'components/Iconfont'
import Loading from 'components/Loading'
import ModalLink from 'components/ModalLink'
import { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import {
  useActivateAccount,
  useActivateStatus,
  useActivating,
  useIsInactivated,
  useL2AccountId,
} from 'store/account/hooks'
import { updateModal, updateOpenRenderFlag } from 'store/app/actions'
import { useModal, useOpenRenderFlag } from 'store/app/hooks'
import { DepositModalOption } from 'store/deposit/types'
import { useCurrentThemeType } from 'store/settings/hooks'
import { ContentWrap, Flex } from 'styles'
import { DepositSelectAssets } from 'views/Deposit/DepositContent'
import { DepositQrcode } from 'views/Deposit/DepositQrcode'
import { DepositSelectOptionItems } from 'views/Deposit/DepositSelectOption'
import { LottieFiles } from '../Lottiefiles'
import imgData from './assets/congratulation.json'

const DepositAssetsContent = styled(Flex)`
  font-size: 14px;
  line-height: 24px;
  margin-top: 10px;
  flex-direction: column;
  color: ${(props) => props.theme.color.text70};
`
const Wallet = styled(Flex)`
  flex-direction: column;
  border: 1px solid ${(props) => props.theme.color.bgGray};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 12px;
  &.deposit {
    margin-top: 18px;
  }
  &.faucet {
    margin-top: 10px;
  }
`
const WalletTitle = styled(Flex)`
  align-items: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 10px;
  .icon-help {
    height: 20px;
    display: flex;
    align-items: center;
    font-weight: 400;
    color: ${(props) => props.theme.color.primary30};
  }
`
const ActiveAccountContent = styled(DepositAssetsContent)`
  line-height: 20px;
  font-size: 14px;
`
const Active = styled(Flex)`
  gap: 16px;
  background: ${(props) => props.theme.color.bgLightGray};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 30px 20px;
  align-items: center;
  margin-top: 10px;
`
const ActiveTitle = styled(Flex)`
  font-weight: 600;
  font-size: 16px;
  color: ${(props) => props.theme.color.text90};
`
const ActiveDesc = styled(Flex)`
  flex-direction: column;
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.color.text60};
`
const ActiveBtn = styled(Button)`
  gap: 4px;
`
const CompleteContent = styled(Flex)`
  align-items: center;
  img {
    width: 126px;
    transform: scaleX(-1);
  }
  span {
    font-size: 14px;
  }
`
const CongratulationWrap = styled(Flex)`
  width: 50%;
  flex-direction: column;
  justify-content: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text70};
`
const CongratulationTitle = styled('div')`
  font-weight: 600;
  font-size: 18px;
  color: ${(props) => props.theme.color.text90};
  margin-bottom: 4px;
`
const StartTradingButton = styled(ActionButton)`
  margin-top: 12px;
`
const StepWrap = styled(Flex)`
  flex-direction: column;
`
const StepFlag = styled(Flex)`
  align-items: center;
  justify-content: center;
`
const StepItem = styled(Flex)`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  justify-content: center;
  align-items: center;
  background: ${(props) => props.theme.color.primary10};
  color: ${(props) => props.theme.color.text60};
  font-weight: 600;
  font-size: 12px;
  &.active {
    background: ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.color.bg};
  }
`
const StepSpace = styled('div')`
  width: 121px;
  height: 4px;
  margin-left: -1px;
  margin-right: -1px;
  background: ${(props) => props.theme.color.primary10};
  &.active {
    background: ${(props) => props.theme.palette.primary.main};
  }
`
const StepTextWrap = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding: 0 60px;
`
const StepText = styled(Flex)`
  align-items: center;
  height: 24px;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.color.text50};
  &.active {
    font-weight: 600;
    color: ${(props) => props.theme.color.text100};
  }
`
const CongratulationsAnimate = styled(Flex)`
  transform: rotateY(180deg);
  width: 50%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
  margin-bottom: 70px;
`

export const OpenMyAccountModal = memo(() => {
  const dispatch = useDispatch()
  const openMyAccountModal = useModal('guide')
  const layer2Id = useL2AccountId()
  const activateStatus = useActivateStatus()
  const isInactivated = useIsInactivated()
  const [activeStep, setActiveStep] = useState(0)
  const [completeOpenMyAccount, setCompleteOpenMyAccount] = useState(false)
  const openRenderFlag = useOpenRenderFlag()
  const activating = useActivating()
  const { t } = useTranslation()
  const activateAccount = useActivateAccount()
  const currentThemeType = useCurrentThemeType()

  useEffect(() => {
    if (!layer2Id) {
      setActiveStep(0)
      setCompleteOpenMyAccount(false)
    } else if (isInactivated) {
      setActiveStep(1)
      setCompleteOpenMyAccount(false)
    } else {
      setCompleteOpenMyAccount(true)
    }
  }, [layer2Id, activateStatus])

  const Step = () => {
    return (
      <StepWrap>
        <StepFlag>
          <StepItem className="active">
            <Iconfont name="icon-check-fill" size={14} />
          </StepItem>
          <StepSpace className="active" />
          <StepSpace className={activeStep === 1 ? 'active' : ''} />
          <StepItem className={activeStep === 1 ? 'active' : ''}>2</StepItem>
        </StepFlag>
        <StepTextWrap>
          <StepText className={activeStep === 0 ? 'active' : ''}>
            {t('open-my-account-deposit-assets', {
              defaultValue: 'Deposit Assets',
            })}
          </StepText>
          <StepText className={activeStep === 1 ? 'active' : ''}>
            {t('open-my-account-active-account', {
              defaultValue: 'Activate Account',
            })}
          </StepText>
        </StepTextWrap>
      </StepWrap>
    )
  }
  const renderContent = () => {
    if (openRenderFlag === 0) {
      return (
        <ContentWrap>
          {!completeOpenMyAccount && Step()}

          {!completeOpenMyAccount && activeStep === 0 && (
            <DepositAssetsContent>
              <Wallet className="deposit" key="deposit">
                <WalletTitle>
                  {t('open-my-account-from-wallet', {
                    defaultValue: 'Deposit from Wallet',
                  })}
                  <Tooltip
                    title={t('open-my-account-deposit-tooltip', {
                      defaultValue:
                        'It requires you have Nexus supported tokens in your wallet',
                    })}>
                    <div className="icon-help">
                      <Iconfont name="icon-infoDefault" size={20} />
                    </div>
                  </Tooltip>
                </WalletTitle>
                <DepositSelectOptionItems
                  onSelectOption={(option) => {
                    if (option === DepositModalOption.SelectAssets) {
                      dispatch(
                        updateOpenRenderFlag({
                          flag: 2,
                        })
                      )
                    } else if (option === DepositModalOption.Qrcode) {
                      dispatch(
                        updateOpenRenderFlag({
                          flag: 3,
                        })
                      )
                    }
                  }}
                />
              </Wallet>
            </DepositAssetsContent>
          )}
          {!completeOpenMyAccount && activeStep === 1 && (
            <ActiveAccountContent>
              {t('open-my-account-signature')}
              <Stack
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '32px 0',
                }}>
                <ActiveBtn
                  sx={{ width: '240px', padding: '6px 0', fontSize: '18px' }}
                  variant="contained"
                  onClick={() => {
                    if (activating) {
                      return
                    }
                    activateAccount()
                  }}>
                  {activating ? (
                    <Loading color="inherit" />
                  ) : (
                    <Iconfont name="icon-Activate" size={16} />
                  )}
                  <span>
                    {activating
                      ? 'Activating'
                      : t('open-my-account-active', {
                          defaultValue: 'Activate',
                        })}
                  </span>
                </ActiveBtn>
              </Stack>
            </ActiveAccountContent>
          )}

          {completeOpenMyAccount && (
            <CompleteContent>
              <CongratulationsAnimate>
                <LottieFiles animationData={imgData} width={168} height={138} />
              </CongratulationsAnimate>
              <CongratulationWrap>
                <CongratulationTitle>
                  {t('open-my-account-congratulations')}
                </CongratulationTitle>

                <span>{t('open-my-account-welcome')}</span>
                <div>
                  <StartTradingButton
                    variant="contained"
                    size="small"
                    onClick={() => {
                      setCompleteOpenMyAccount(false)
                      dispatch(updateModal({ modal: 'guide', open: false }))
                    }}>
                    <Iconfont name="icon-Trading" size={20} />{' '}
                    <span>Start trading</span>
                  </StartTradingButton>
                </div>
              </CongratulationWrap>
            </CompleteContent>
          )}
        </ContentWrap>
      )
    } else if (openRenderFlag === 2) {
      return <DepositSelectAssets />
    } else if (openRenderFlag === 3) {
      return <DepositQrcode />
    }
    return null
  }

  return (
    <ModalLink
      width="560px"
      isIn={openMyAccountModal}
      header={
        openRenderFlag === 0
          ? t('open-my-account-title')
          : t('deposit-select-assets')
      }
      onClose={() => {
        dispatch(updateModal({ modal: 'guide', open: false }))
      }}
      onHeaderClick={
        openRenderFlag === 0
          ? undefined
          : () => {
              dispatch(
                updateOpenRenderFlag({
                  flag: 0,
                })
              )
            }
      }>
      {renderContent()}
    </ModalLink>
  )
})
