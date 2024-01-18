import { styled } from '@mui/material/styles'
import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useActivating } from 'store/account/hooks'
import { updateModal } from '../../store/app/actions'
import { Wing10 } from '../../styles'
import { ActionButton } from './ActionButton'

const ButtonWrap = styled(ActionButton)`
  box-shadow: unset !important;
  background: ${(props) => props.theme.palette.primary.main};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  font-weight: 600;
  &:hover {
    background: ${(props) => props.theme.palette.primary.main};
  }
`
export const ActivateAccountButton: FC<{
  disabled?: boolean
}> = memo(({ disabled }) => {
  const activating = useActivating()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  return (
    <ButtonWrap
      loading={activating}
      disabled={disabled || activating}
      fullWidth={true}
      color={'primary'}
      variant={'contained'}
      onClick={() => {
        dispatch(updateModal({ modal: 'guide', open: true }))
      }}>
      <Wing10>
        {t('swap-btn-activate', { defaultValue: 'Activate Account' })}
      </Wing10>
    </ButtonWrap>
  )
})
