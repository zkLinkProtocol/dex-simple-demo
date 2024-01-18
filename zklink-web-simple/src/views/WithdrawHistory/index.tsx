import { styled } from '@mui/material'
import { memo, useEffect } from 'react'
import { useAppDispatch } from 'store'
import { useAccountInfo } from 'store/account/hooks'
import { useLinkConnected } from 'store/link/hooks'
import {
  fetchWithdrawalTransactions,
  updateWithdrawalTransactions,
} from 'store/withdraw/actions'
import { useWithdrawalTransactions } from 'store/withdraw/hook'
import { ContentWrap } from 'styles'
import { BalancesWrap } from 'views/Balances'
import { TransactionItem } from './Transaction'

const TransactionsWrap = styled(ContentWrap)`
  margin-top: -24px;
`

const Title = styled('div')`
  height: 32px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
  padding: 8px 12px;
  color: ${(props) => props.theme.color.text70};
  display: flex;
  align-items: center;
`

export const WithdrawHistory = memo(() => {
  const dispatch = useAppDispatch()
  const transactions = useWithdrawalTransactions()
  const accountInfo = useAccountInfo()

  const isLinkConnected = useLinkConnected()

  const { address = '' } = accountInfo ?? {}

  const { list } = transactions

  useEffect(() => {
    if (address) {
      dispatch(fetchWithdrawalTransactions({ page: 0, pageSize: 10 }))
    } else {
      dispatch(updateWithdrawalTransactions({ list: [], total: 0 }))
    }

    return () => {
      dispatch(updateWithdrawalTransactions({ list: [], total: 0 }))
    }
  }, [address])

  if (!isLinkConnected) {
    return null
  }

  if (!list.length) {
    return null
  }

  return (
    <TransactionsWrap>
      <BalancesWrap>
        <Title>
          <span>Transactions</span>
        </Title>

        {list.map((item) => (
          <TransactionItem item={item} />
        ))}
      </BalancesWrap>
    </TransactionsWrap>
  )
})
