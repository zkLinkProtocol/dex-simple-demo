import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { ActionButton } from './ActionButton'

export const InsufficientBalanceButton = memo(() => {
  const { t } = useTranslation()
  return (
    <ActionButton
      disabled={true}
      color={'primary'}
      fullWidth={true}
      variant={'contained'}>
      {t('swap-btn-insufficient', { defaultValue: 'Insufficient balance' })}
    </ActionButton>
  )
})
