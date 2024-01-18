import { NoData } from 'components/NoData'
import i18n from 'i18n'
import { memo, useMemo, useState } from 'react'
import {
  useFetchTransferHistory,
  useTransferList,
  useTransferTotal,
} from 'store/history/hooks'
import { HistoryPagination } from './HistoryPagination'
import { HistoryTab } from './Tab'
import { TransferRow } from './TransferRow'
import {
  HistoryTable,
  MobileTableContent,
  TableAmount,
  TableAsset,
  TableContent,
  TableDate,
  TableHead,
  TableStatus,
  TableTransferAdd,
  TableTxid,
} from './style'

export const TransferHistoryPage = memo(() => {
  const transferList = useTransferList()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [limit] = useState<number>(10)
  useFetchTransferHistory(currentPage, limit)
  const total = useTransferTotal()

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
          <TableAmount>
            {i18n.t('balance-history-amount', { defaultValue: 'Amount' })}
          </TableAmount>
          <TableAmount>
            {i18n.t('balance-history-fee', { defaultValue: 'Fee' })}
          </TableAmount>
          <TableAsset>
            {i18n.t('balance-history-asset', { defaultValue: 'Asset' })}
          </TableAsset>
          <TableTransferAdd>from</TableTransferAdd>
          <TableTransferAdd>
            {i18n.t('balance-history-destination', {
              defaultValue: 'Destination',
            })}
          </TableTransferAdd>
          <TableTxid>
            {i18n.t('balance-history-txid', { defaultValue: 'Txid' })}
          </TableTxid>
          <TableStatus>
            {i18n.t('balance-history-status', { defaultValue: 'Status' })}
          </TableStatus>
        </TableHead>
        <TableContent>
          {transferList.length ? (
            transferList?.map((item, index) => {
              return <TransferRow transferItem={item} key={item.txHash} />
            })
          ) : (
            <NoData size={88} />
          )}
        </TableContent>

        {/* mobile */}
        <MobileTableContent>
          {transferList.length ? (
            transferList?.map((item, index) => {
              return <TransferRow transferItem={item} key={item.txHash} />
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
