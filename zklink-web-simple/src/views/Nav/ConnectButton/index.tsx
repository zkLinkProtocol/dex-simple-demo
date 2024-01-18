import { Button, styled } from '@mui/material'
import { useWeb3React } from '@web3-react/core'
import Iconfont from 'components/Iconfont'
import i18n from 'i18n'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateModal } from 'store/app/actions'
import { useAddress, useWeb3Connected } from 'store/app/hooks'
import { useLinkConnected } from 'store/link/hooks'
import { encryptionAddress } from 'utils/address'
import { GaEventName, gaEvent } from 'utils/ga'

export const ConnectButtonWrap = styled(Button)`
  flex-shrink: 0;
  height: 36px;
  font-weight: 400;
  gap: 4px;
  background: ${(props) => props.theme.color.bgNavButton};
  border: 1px solid rgba(0, 0, 0, 0);
  color: ${(props) => props.theme.color.text90};
  line-height: 24px;
  white-space: nowrap;

  &:hover {
    border: 1px solid ${(props) => props.theme.palette.primary.main};
    color: ${(props) => props.theme.palette.primary.main};
    background: ${(props) => props.theme.color.bg};
  }
`

export const ConnectButton = memo(() => {
  const dispatch = useDispatch()
  const isLinkConnected = useLinkConnected()
  const address = useAddress()
  const web3Connected = useWeb3Connected()
  const { ENSName } = useWeb3React()

  const onClickConnectButton = () => {
    if (!web3Connected) {
      dispatch(updateModal({ modal: 'wallets', open: true }))
      gaEvent(GaEventName.click_nav_connect_wallet, {
        vendor: window.navigator.vendor,
      })
    } else if (!isLinkConnected) {
      dispatch(updateModal({ modal: 'verify', open: true }))
    } else {
      dispatch(updateModal({ modal: 'account', open: true }))
      gaEvent(GaEventName.click_account_modal)
    }
  }

  const renderConnectButton = () => {
    if (!web3Connected) {
      return i18n.t('connect-net')
    }
    if (!isLinkConnected) {
      return (
        <>
          <Iconfont name="icon-Warning1" size={20}></Iconfont>
          {ENSName ?? encryptionAddress(address)}
        </>
      )
    }
    return ENSName ?? encryptionAddress(address)
  }

  return (
    <ConnectButtonWrap onClick={onClickConnectButton}>
      {renderConnectButton()}
    </ConnectButtonWrap>
  )
})
