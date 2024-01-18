import { styled } from '@mui/material'
import { ActionButton } from 'components/Buttons/ActionButton'

export const OrderButton = styled(ActionButton)({
  color: '#FFF',
  fontSize: 16,
  '&:disabled': {
    cursor: 'not-allowed',
    color: '#FFF',
  },
})
OrderButton.defaultProps = {
  fullWidth: true,
}

export const LongOrderButton = styled(OrderButton)(({ theme }) => ({
  background: theme.color.buy30,
  '&:disabled': {
    background: theme.color.buy20,
  },
  '&:hover': {
    '&:not(:disabled)': {
      background: theme.color.buy40,
    },
  },
}))

export const ShortOrderButton = styled(OrderButton)(({ theme }) => ({
  background: theme.color.sell30,
  '&:disabled': {
    background: theme.color.sell20,
  },
  '&:hover': {
    '&:not(:disabled)': {
      background: theme.color.sell40,
    },
  },
}))
