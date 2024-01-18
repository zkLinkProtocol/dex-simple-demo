import { styled } from '@mui/material'
import { ActionButton } from './ActionButton'

export const DisconnectButton = styled(ActionButton)`
  font-weight: 500;
  color: ${(props) => props.theme.color.text80};
  background: ${(props) => props.theme.color.bg};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid ${(props) => props.theme.color.text10};
`
