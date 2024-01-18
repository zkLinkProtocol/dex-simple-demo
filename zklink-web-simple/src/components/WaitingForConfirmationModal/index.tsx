import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import Iconfont from 'components/Iconfont'
import ModalLink from 'components/ModalLink'
import { DISCORD_LINK } from 'config/community'
import i18n from 'i18n'
import { memo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useL2AccountId } from 'store/account/hooks'
import { updateModal, updateOpenRenderFlag } from 'store/app/actions'
import { useCurrentNetwork, useFaucetQueueLen, useModal } from 'store/app/hooks'
import { getDepositsEstimateMinutes } from 'store/deposit/hook'
import { useViewInExplorerLink } from 'store/link/hooks'
import { ContentWrap, Flex } from 'styles'
import { bn } from 'utils/number'
import { LottieFiles } from '../Lottiefiles'
import loadingData from './assets/loading.json'

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
  background: ${(props) => props.theme.color?.primary10};
  color: ${(props) => props.theme.color?.text50};
  font-weight: 600;
  font-size: 12px;
  &.active {
    background: ${(props) => props.theme.color?.primary40};
    color: ${(props) => props.theme.color?.bg};
  }
  &.loading {
    background: ${(props) => props.theme.color?.bg};
    border: 1px solid ${(props) => props.theme.color?.primary40};
    color: ${(props) => props.theme.color?.primary40};
    z-index: 10;
  }
`
const StepSpace = styled('div')`
  width: 121px;
  height: 6px;
  margin-left: -1px;
  margin-right: -1px;
  background: ${(props) => props.theme.color?.primary10};
  &.active {
    background: ${(props) => props.theme.color?.primary40};
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
  color: ${(props) => props.theme.color?.text50};
  &.active {
    font-weight: 600;
    color: ${(props) => props.theme.color?.text100};
  }
`
const WaitText = styled(Flex)`
  width: 265px;
  flex-direction: column;
  justify-content: flex-start;
`
const WaitWrap = styled(Flex)`
  flex-direction: column;
  align-items: center;
  margin: 32px 0;
`
const WaitContent = styled(Flex)`
  gap: 8px;
  align-items: center;
`
const WaitLot = styled(Flex)`
  width: 74px;
  height: 55px;
`
const WaitTextItem = styled('div')`
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${(props) => props.theme.color?.text60};
  &.title {
    font-weight: 600;
  }
`
const ViewAndCloseWrap = styled(Flex)`
  width: 265px;
  gap: 12px;
  align-items: center;
  padding-top: 18px;
  margin-left: 82px;
`
const ViewWrap = styled(Flex)`
  height: 20px;
  padding: 0 5px;
  margin-left: -5px;
  align-items: center;
  gap: 6px;
  font-weight: 400;
  font-size: 12px;
  color: ${(props) => props.theme.color?.text70};
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.color?.text90};
    background: ${(props) => props.theme.color?.bgLightGray};
    border-radius: 20px;
  }
`
const CloseWrap = styled(Flex)`
  justify-content: center;
  align-items: center;
  padding: 0 8px;
  height: 18px;
  font-weight: 400;
  font-size: 12px;
  border-radius: 15px;
  background: ${(props) => props.theme.color?.primary10};
  color: ${(props) => props.theme.color?.primary40};
`

export const WaitingForConfirmationModal = memo(() => {
  const dispatch = useDispatch()
  const openMyAccountModal = useModal('guide')
  const waitingForConfirmationModal = useModal('depositing')
  const viewInExplorerLink = useViewInExplorerLink()
  const accountId = useL2AccountId()
  const [second, setSecond] = useState(30)
  const queue = useFaucetQueueLen()
  const currentNetwork = useCurrentNetwork()

  useEffect(() => {
    if (accountId) {
      dispatch(updateModal({ modal: 'depositing', open: false }))
      dispatch(updateOpenRenderFlag({ flag: 0 }))
    }
  }, [accountId])
  useEffect(() => {
    if (openMyAccountModal) {
      return
    }
    if (!waitingForConfirmationModal) {
      setSecond(30)
      return
    }
    if (second <= 0) {
      dispatch(updateModal({ modal: 'depositing', open: false }))
      setSecond(30)
    }
    setTimeout(() => {
      setSecond(second - 1)
    }, 1000)
  }, [second, waitingForConfirmationModal])

  const Step = () => {
    return (
      <StepWrap>
        <StepFlag>
          <StepItem className="active">
            <Iconfont name="icon-check-fill" size={14} />
          </StepItem>
          <StepSpace className="active" />
          <StepItem className="loading">
            <Iconfont name="icon-more" size={20} />
          </StepItem>
          <StepSpace />
          <StepItem>2</StepItem>
        </StepFlag>
        <StepTextWrap>
          <StepText className="active">
            {i18n.t('open-my-account-deposit-assets', {
              defaultValue: 'Deposit Assets',
            })}
          </StepText>
          <StepText>
            {i18n.t('open-my-account-active-account', {
              defaultValue: 'Activate Account',
            })}
          </StepText>
        </StepTextWrap>
      </StepWrap>
    )
  }
  return (
    <ModalLink
      width="512px"
      isIn={waitingForConfirmationModal}
      header={viewInExplorerLink ? 'Waiting...' : 'Faucet Processing...'}
      onClose={() => {
        dispatch(updateModal({ modal: 'depositing', open: false }))
        setSecond(5)
      }}>
      <ContentWrap>
        {openMyAccountModal && Step()}
        <WaitWrap>
          <WaitContent>
            <WaitLot>
              <LottieFiles animationData={loadingData} width={74} height={55} />
            </WaitLot>
            <WaitText>
              <WaitTextItem className={openMyAccountModal ? '' : 'title'}>
                {i18n.t('waiting-initiated', {
                  defaultValue: 'Transactions initiated.',
                })}
              </WaitTextItem>
              <WaitTextItem>
                {viewInExplorerLink ? (
                  <>
                    It may take up to{' '}
                    {getDepositsEstimateMinutes(currentNetwork.layerOneChainId)}{' '}
                    minutes for the deposit to be verified.
                    <br />
                    You may close this popup and wait for the assets to show on
                    your Nexus balance.
                  </>
                ) : (
                  <>
                    {bn(queue).add(1).toString()} users are ahead of you in the
                    queue. Your request will be processed in{' '}
                    {Math.ceil((queue + 1) * 0.03).toFixed(0)} minutes by
                    estimation.
                    <br />
                    <Stack
                      component="a"
                      href={DISCORD_LINK}
                      target="_black"
                      sx={{
                        marginTop: 1,
                        color: '#FFF',
                      }}
                      flexDirection="row">
                      <Iconfont name="icon-Discord" size={16} />
                      <span style={{ marginLeft: 4 }}>
                        Get support in the Nexus Discord channel
                      </span>
                    </Stack>
                  </>
                )}
              </WaitTextItem>
            </WaitText>
          </WaitContent>
          <ViewAndCloseWrap>
            {viewInExplorerLink ? (
              <ViewWrap
                onClick={() => {
                  window.open(viewInExplorerLink, '_blank')
                }}>
                <Iconfont name="icon-view" size={14} />

                {i18n.t('common-view-explorer', {
                  defaultValue: 'View on explorer',
                })}
              </ViewWrap>
            ) : null}

            {!openMyAccountModal && (
              <CloseWrap>
                {i18n.t('waiting-closing', { defaultValue: 'closing in ' })}
                {second}s
              </CloseWrap>
            )}
          </ViewAndCloseWrap>
        </WaitWrap>
      </ContentWrap>
    </ModalLink>
  )
})
