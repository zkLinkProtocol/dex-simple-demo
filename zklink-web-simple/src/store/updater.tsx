import { memo } from 'react'
import AccountUpdater from 'store/account/updater'
import AppUpdater from 'store/app/updater'
import DepositUpdater from 'store/deposit/updater'
import LinkUpdater from 'store/link/updater'
import SettingsUpdater from 'store/settings/updater'
import WithdrawUpdater from 'store/withdraw/updater'

export const StateUpdater = memo(() => {
  return (
    <>
      <AccountUpdater />
      <AppUpdater />
      <LinkUpdater />
      <DepositUpdater />
      <SettingsUpdater />
      <WithdrawUpdater />
    </>
  )
})
