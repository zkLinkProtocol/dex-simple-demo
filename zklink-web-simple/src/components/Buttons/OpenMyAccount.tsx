import { FC, ReactNode, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useActivating } from 'store/account/hooks'
import { ConnectButtonWrap } from './ConnectWallet'

export const OpenMyAccountButton: FC<{ children?: ReactNode }> = memo(
  ({ children }) => {
    const activating = useActivating()
    const { t } = useTranslation()
    const navigate = useNavigate()

    return (
      <ConnectButtonWrap
        loading={activating}
        disabled={activating}
        onClick={() => {
          navigate('/deposit')
        }}>
        {children ?? 'Please deposit first'}
      </ConnectButtonWrap>
    )
  }
)
