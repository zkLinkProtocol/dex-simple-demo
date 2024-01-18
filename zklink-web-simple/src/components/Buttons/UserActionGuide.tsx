import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useIsInactivated, useL2AccountId } from 'store/account/hooks'
import { useLinkConnected } from 'store/link/hooks'
import { ConnectWalletButton } from './ConnectWallet'
import { OpenMyAccountButton } from './OpenMyAccount'

export const UserActionGuideButton = memo(() => {
  const connected = useLinkConnected()
  const layer2Id = useL2AccountId()
  const isInactivated = useIsInactivated()
  const { t } = useTranslation()

  if (!connected) {
    return <ConnectWalletButton />
  }
  if (!layer2Id) {
    return <OpenMyAccountButton />
  }
  if (isInactivated) {
    return (
      <OpenMyAccountButton>
        {t('open-my-account-active-my-account', {
          defaultValue: 'Activate My Account',
        })}
      </OpenMyAccountButton>
    )
  }

  return null
})
