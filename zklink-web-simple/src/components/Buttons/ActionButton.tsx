import { Button, ButtonProps, styled } from '@mui/material'
import Loading from 'components/Loading'
import { FC, memo } from 'react'

const ButtonWrap = styled(Button, {
  shouldForwardProp: (prop) => ['loading'].includes(String(prop)) === false,
})`
  gap: 4px;
`

export interface ActionButtonProps extends ButtonProps {
  loading?: boolean
}

export const ActionButton: FC<ActionButtonProps> = memo((props) => {
  return (
    <ButtonWrap {...props}>
      {props.loading ? <Loading sx={{ mr: 0.5 }} /> : null} {props.children}
    </ButtonWrap>
  )
})
