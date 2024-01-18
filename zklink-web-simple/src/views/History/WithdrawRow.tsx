import { ApiHistoryItem } from 'api/v1/txHistory'
import Loading from 'components/Loading'
import dayjs from 'dayjs'
import useResize from 'hooks/useResize'
import { FC, memo } from 'react'
import { findNetworks, useCurrencyById, useEthProperty } from 'store/app/hooks'
import { useWithdrawStatus } from 'store/withdraw/hook'
import { WithdrawStatus } from 'store/withdraw/types'
import { encryptionAddress } from 'utils/address'
import { viewOnZKLinkExplorer } from 'utils/explorer'
import { DateFormatter } from '../../utils/datetime'
import {
  MobileTableCoinName,
  MobileTableCoinTime,
  MobileTableItem,
  MobileTableItemAmount,
  MobileTableItemLeft,
  MobileTableItemLeftInfo,
  MobileTableItemRight,
  MobileTableItemTxid,
  StatusItem,
  TableAddContent,
  TableAmount,
  TableAssetContent,
  TableDateContent,
  TableId,
  TableRow,
  TableStatus,
  TableTxidContent,
} from './style'

export const WithdrawRow: FC<{
  withdrawItem: ApiHistoryItem
}> = memo(({ withdrawItem }) => {
  const { currencyId = 0, chainId = 0, txHash, extra = '' } = withdrawItem
  const { withdrawToL1 } = JSON.parse(extra) as {
    withdrawFeeRatio: number
    withdrawToL1: 0 | 1
  }
  const status: WithdrawStatus = useWithdrawStatus(txHash)
  const { isMobile } = useResize()

  const ethProperty = useEthProperty()

  const currency = useCurrencyById({ id: currencyId })
  let chain = findNetworks({ layerTwoChainId: chainId })

  if (withdrawToL1) {
    chain = findNetworks({ layerTwoChainId: ethProperty.chainId })
  }

  return !isMobile ? (
    <TableRow>
      <TableDateContent>
        {DateFormatter.toISODateTime(withdrawItem.createdAt)}
      </TableDateContent>
      <TableId>{chain?.name}</TableId>
      <TableAmount>{withdrawItem.amount}</TableAmount>
      <TableAmount>{withdrawItem.fee}</TableAmount>
      <TableAssetContent>{currency?.name}</TableAssetContent>
      <TableAddContent>{withdrawItem.toAddress}</TableAddContent>
      <TableTxidContent onClick={() => viewOnZKLinkExplorer(txHash)}>
        {encryptionAddress(txHash)}
      </TableTxidContent>
      <TableStatus>
        <StatusItem className={status}>
          {status === WithdrawStatus.Loading ? <Loading /> : status}
        </StatusItem>
      </TableStatus>
    </TableRow>
  ) : (
    <MobileTableItem onClick={() => viewOnZKLinkExplorer(txHash)}>
      <MobileTableItemLeft>
        <img src={currency?.tokenIconUrl} alt="" />
        <MobileTableItemLeftInfo>
          <MobileTableCoinName>
            {currency?.name}
            <div>
              <span>{chain?.name}</span>
            </div>
          </MobileTableCoinName>
          <MobileTableCoinTime>
            {dayjs(withdrawItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </MobileTableCoinTime>
        </MobileTableItemLeftInfo>
      </MobileTableItemLeft>
      <MobileTableItemRight>
        <MobileTableItemAmount>
          <span>{withdrawItem.amount}</span>
        </MobileTableItemAmount>
        <MobileTableItemTxid>
          <span>{encryptionAddress(txHash)}</span>
        </MobileTableItemTxid>
        <StatusItem className={status}>
          {status === WithdrawStatus.Loading ? <Loading /> : status}
        </StatusItem>
      </MobileTableItemRight>
    </MobileTableItem>
  )
})
