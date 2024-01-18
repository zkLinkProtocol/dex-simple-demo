import { styled } from '@mui/material/styles'
import { FC, ReactNode, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useActivating } from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import { useWeb3Connected } from 'store/app/hooks'
import { useLinkStatus } from 'store/link/hooks'
import { LinkStatus } from 'store/link/types'
import { GaEventName, gaEvent } from 'utils/ga'
import { ActionButton } from './ActionButton'

export const ConnectButtonWrap = styled(ActionButton)`
  font-size: 16px;
`
ConnectButtonWrap.defaultProps = {
  variant: 'contained',
  fullWidth: true,
}
export const ConnectWalletButton: FC<{ children?: ReactNode }> = memo(
  ({ children }) => {
    const activating = useActivating()
    const linkStatus = useLinkStatus()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const web3Connected = useWeb3Connected()

    const connecting =
      activating ||
      linkStatus === LinkStatus.linkL1Pending ||
      linkStatus === LinkStatus.linkL2Pending
    return (
      <ConnectButtonWrap
        loading={connecting}
        disabled={connecting}
        onClick={() => {
          dispatch(updateModal({ modal: 'wallets', open: true }))
          gaEvent(GaEventName.click_order_connect_wallet)
        }}>
        {web3Connected
          ? 'Connect zkLink'
          : t('connect-net', {
              defaultValue: 'Connect Wallet',
            })}
      </ConnectButtonWrap>
    )
  }
)
