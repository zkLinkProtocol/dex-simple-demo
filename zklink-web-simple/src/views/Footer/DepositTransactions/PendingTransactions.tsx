import { Close } from '@mui/icons-material'
import { Stack, styled, Typography } from '@mui/material'
import React, { memo } from 'react'
import { useUnexpiredDepositTransactions } from 'store/deposit/hook'
import { useAppDispatch } from '../../../store'
import { updateModal } from '../../../store/app/actions'
import { PendingTransactionItem } from './PendingTransactionItem'

const Wrap = styled(Stack)`
  position: relative;
  gap: 12px;
  padding: 16px;
  min-width: 340px;
  background-color: ${(props) => props.theme.color.bg};
  border: 1px solid ${(props) => props.theme.color.text20};
  border-radius: 8px;
`
const Title = styled(Typography)`
  color: ${(props) => props.theme.color.text90};
`
const CloseButton = styled(Stack)`
  justify-content: center;
  align-self: flex-start;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  margin: -8px -8px -8px 0;
  :hover {
    color: ${(props) => props.theme.palette.error.main};
  }
`

export const PendingTransactions = memo(() => {
  const dispatch = useAppDispatch()
  const transactions = useUnexpiredDepositTransactions()

  return (
    <Wrap>
      <Stack direction="row" justifyContent="space-between">
        <Title variant="subtitle2">Pending Transactions</Title>
        <CloseButton
          onClick={() =>
            dispatch(updateModal({ modal: 'pendingTxs', open: false }))
          }>
          <Close fontSize="inherit" />
        </CloseButton>
      </Stack>
      {transactions?.map((item) => {
        return <PendingTransactionItem key={item.ethHash} item={item} />
      })}
    </Wrap>
  )
})
