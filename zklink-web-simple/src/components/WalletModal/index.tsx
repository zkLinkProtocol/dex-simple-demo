import { Stack, styled } from '@mui/material'
import { ActionButton } from 'components/Buttons/ActionButton'
import Iconfont from 'components/Iconfont'
import Loading from 'components/Loading'
import ModalLink from 'components/ModalLink'
import { connections } from 'connection'
import { ActivationStatus, useActivationState } from 'connection/activate'
import { memo, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { updateModal } from 'store/app/actions'
import { useModal } from 'store/app/hooks'
import { updateLinkStatus } from 'store/link/actions'
import { useLinkStatus } from 'store/link/hooks'
import { LinkStatus } from 'store/link/types'
import { ContentWrap, FlexCenter } from 'styles'
import Option from './Option'

const ErrorMessage = styled('div')`
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
  color: ${(props) => props.theme.color.text60};
  padding: 16px 0 40px;
`

export const ChooseWallet = memo(() => {
  return (
    <Stack spacing={2}>
      {connections
        .filter((connection) => connection.shouldDisplay())
        .map((connection) => (
          <Option key={connection.getName()} connection={connection} />
        ))}
    </Stack>
  )
})

export const Failed = memo(() => {
  const dispatch = useDispatch()
  const { tryActivation, activationState } = useActivationState()
  if (activationState.status !== ActivationStatus.ERROR) return null

  const retry = () => {}
  const cleanErrorMessage = useCallback(() => {
    dispatch(updateLinkStatus(LinkStatus.init))
  }, [])

  return (
    <>
      <ErrorMessage>
        The connection attempt failed. Please click try again and follow the
        steps to connect in your wallet.
      </ErrorMessage>
      <Stack direction={'row'} spacing={1} justifyContent="flex-end">
        <ActionButton
          variant="outlined"
          size="small"
          onClick={() => {
            cleanErrorMessage()
          }}>
          Back to wallet selection
        </ActionButton>
        <ActionButton variant="contained" size="small" onClick={retry}>
          <Iconfont name="icon-refresh" size={16} />
          Try again
        </ActionButton>
      </Stack>
    </>
  )
})

export const Connecting = memo(() => {
  return (
    <FlexCenter style={{ minHeight: '136px' }}>
      <Loading />
    </FlexCenter>
  )
})

export const WalletModal = memo(() => {
  const dispatch = useDispatch()
  const walletModal = useModal('wallets')
  const linkStatus = useLinkStatus()
  const connecting = linkStatus === LinkStatus.linkL1Pending
  const connectFail = linkStatus === LinkStatus.linkL1Failed
  const header = connecting
    ? `Connecting`
    : connectFail
    ? `Error Connecting`
    : `Connect a wallet`

  const { activationState } = useActivationState()

  return (
    <ModalLink
      width="400px"
      isIn={walletModal}
      header={header}
      onClose={() => {
        dispatch(updateModal({ modal: 'wallets', open: false }))
      }}>
      <ContentWrap>
        {activationState.status === ActivationStatus.ERROR ? (
          <Failed />
        ) : (
          <ChooseWallet />
        )}
      </ContentWrap>
    </ModalLink>
  )
})
