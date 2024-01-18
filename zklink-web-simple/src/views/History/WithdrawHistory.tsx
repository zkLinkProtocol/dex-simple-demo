import { NoData } from 'components/NoData'
import i18n from 'i18n'
import { memo, useMemo, useState } from 'react'
import {
  useFetchWithdrawHistory,
  useWithdrawList,
  useWithdrawTotal,
} from 'store/history/hooks'
import { HistoryPagination } from './HistoryPagination'
import { HistoryTab } from './Tab'
import { WithdrawRow } from './WithdrawRow'
import {
  HistoryTable,
  MobileTableContent,
  TableAdd,
  TableAmount,
  TableAsset,
  TableContent,
  TableDate,
  TableHead,
  TableId,
  TableStatus,
  TableTxid,
} from './style'

export const WithdrawHistoryPage = memo(() => {
  const withdrawList = useWithdrawList()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit] = useState<number>(10)

  useFetchWithdrawHistory(currentPage, limit)
  const total = useWithdrawTotal()

  const totalPage = useMemo(() => {
    return Math.ceil(total / limit)
  }, [limit, total])

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
          <TableAmount>
            {i18n.t('balance-history-fee', { defaultValue: 'Fee' })}
          </TableAmount>
          <TableAsset>
            {i18n.t('balance-history-asset', { defaultValue: 'Asset' })}
          </TableAsset>
          <TableAdd>
            {i18n.t('balance-history-destination', {
              defaultValue: 'Destination',
            })}
          </TableAdd>
          <TableTxid>
            {i18n.t('balance-history-txid', { defaultValue: 'Txid' })}
          </TableTxid>
          <TableStatus>
            {i18n.t('balance-history-status', { defaultValue: 'Status' })}
          </TableStatus>
        </TableHead>
        <TableContent>
          {withdrawList.length ? (
            withdrawList?.map((item, index) => {
              return <WithdrawRow withdrawItem={item} key={item.txHash} />
            })
          ) : (
            <NoData size={88} />
          )}
        </TableContent>

        {/* mobile */}
        <MobileTableContent>
          {withdrawList.length ? (
            withdrawList?.map((item, index) => {
              return <WithdrawRow withdrawItem={item} key={item.txHash} />
            })
          ) : (
            <NoData size={65} width="100vw" height="50vw" />
          )}
        </MobileTableContent>

        {totalPage > 1 ? (
          <HistoryPagination
            page={currentPage}
            count={totalPage}
            onChange={(event, page) => setCurrentPage(page)}
          />
        ) : null}
      </HistoryTable>
    </>
  )
})
