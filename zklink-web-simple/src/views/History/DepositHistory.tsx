import { ApiHistoryItem } from 'api/v1/txHistory'
import { NoData } from 'components/NoData'
import i18n from 'i18n'
import { memo, useMemo, useState } from 'react'
import { useUnexpiredDepositTransactions } from 'store/deposit/hook'
import { DepositETHTransaction } from 'store/deposit/types'
import {
  useDepositList,
  useDepositTotal,
  useFetchDepositHistory,
} from 'store/history/hooks'
import { DepositRow } from './DepositRow'
import { HistoryPagination } from './HistoryPagination'
import { HistoryTab } from './Tab'
import {
  HistoryTable,
  MobileTableContent,
  TableAmount,
  TableAsset,
  TableContent,
  TableDate,
  TableHead,
  TableId,
  TableStatus,
  TableTxid,
} from './style'

export const DepositHistoryPage = memo(() => {
  const pendingTxs = useUnexpiredDepositTransactions()
  const depositList = useDepositList()
  const [currentPage, setCurrentPage] = useState<number>(0)
  const limit = 10

  useFetchDepositHistory(currentPage, limit)

  const total = useDepositTotal()

  const totalPage = useMemo(() => {
    return Math.ceil(total / limit)
  }, [total])

  const list: Array<ApiHistoryItem | DepositETHTransaction> = useMemo(() => {
    if (currentPage === 0) {
      return [...pendingTxs, ...depositList]
    }
    return depositList
  }, [currentPage, pendingTxs, depositList])

  return (
    <>
      <HistoryTab />
      <HistoryTable>
        <TableHead>
          <TableDate className="data">
            {i18n.t('balance-history-date', { defaultValue: 'Date' })}
          </TableDate>
          <TableId>
            {i18n.t('balance-history-chain', { defaultValue: 'Chain' })}
          </TableId>
          <TableAmount>
            {i18n.t('balance-history-amount', { defaultValue: 'Amount' })}
          </TableAmount>
          <TableAsset>
            {i18n.t('balance-history-asset', { defaultValue: 'Asset' })}
          </TableAsset>

          <TableTxid>
            {i18n.t('balance-history-txid', { defaultValue: 'Txid' })}
          </TableTxid>
          <TableStatus>
            {i18n.t('balance-history-status', { defaultValue: 'Status' })}
          </TableStatus>
        </TableHead>
        <TableContent>
          {list.length ? (
            list?.map((item) => {
              return <DepositRow depositItem={item} key={item.ethHash} />
            })
          ) : (
            <NoData size={88} />
          )}
        </TableContent>
        {/* mobile */}
        <MobileTableContent>
          {list.length ? (
            list?.map((item) => {
              return <DepositRow depositItem={item} key={item.ethHash} />
            })
          ) : (
            <NoData size={65} width="100vw" height="50vw" />
          )}
        </MobileTableContent>
        {totalPage > 1 ? (
          <HistoryPagination
            page={currentPage + 1}
            count={totalPage}
            onChange={(event, page) => setCurrentPage(page)}
          />
        ) : null}
      </HistoryTable>
    </>
  )
})
