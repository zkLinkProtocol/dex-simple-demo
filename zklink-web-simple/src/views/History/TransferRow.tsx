import { ApiHistoryItem, HistoryStatusType } from 'api/v1/txHistory'
import dayjs from 'dayjs'
import useResize from 'hooks/useResize'
import i18n from 'i18n'
import { FC, memo } from 'react'
import { findNetworks, useSpotCurrencies } from 'store/app/hooks'
import { TokenId } from 'types'
import { encryptionAddress } from 'utils/address'
import { DateFormatter } from 'utils/datetime'
import { viewOnZKLinkExplorer } from 'utils/explorer'
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
  TableAmount,
  TableAssetContent,
  TableDateContent,
  TableRow,
  TableStatus,
  TableTransferAddContent,
  TableTxidContent,
} from './style'

export const TransferRow: FC<{
  transferItem: ApiHistoryItem
}> = memo(({ transferItem }) => {
  const { txHash } = transferItem
  const tokens = useSpotCurrencies()
  const { isMobile } = useResize()

  const findChainFromToken = (tokenId: TokenId) => {
    return tokens.find((transferItem) => transferItem.id === tokenId)
  }
  const clickHistoryTxid = (obj: any) => {
    viewOnZKLinkExplorer(obj.txHash)
  }
  const showTransferStatus = (transfer: ApiHistoryItem) => {
    let status
    if (transfer.txStatus === HistoryStatusType.fail) {
      status = i18n.t('balance-history-status-fail', { defaultValue: 'Fail' })
    } else if (transfer.txStatus === HistoryStatusType.success) {
      status = i18n.t('balance-history-status-success', {
        defaultValue: 'Success',
      })
    } else {
      status = i18n.t('balance-history-status-pending', {
        defaultValue: 'Pending',
      })
    }
    return status
  }

  return !isMobile ? (
    <TableRow>
      <TableDateContent>
        {DateFormatter.toISODateTime(transferItem.createdAt)}
      </TableDateContent>
      <TableAmount>{transferItem.amount}</TableAmount>
      <TableAmount>{transferItem.fee}</TableAmount>
      <TableAssetContent>
        {/* <img src={findChainFromToken(transferItem.l2Token)?.currencyIcon} /> */}
        {findChainFromToken(transferItem.currencyId)?.name}
      </TableAssetContent>
      <TableTransferAddContent>
        {encryptionAddress(transferItem.fromAddress)}
      </TableTransferAddContent>
      <TableTransferAddContent>
        {encryptionAddress(transferItem.toAddress)}
      </TableTransferAddContent>
      <TableTxidContent
        onClick={() => {
          clickHistoryTxid(transferItem)
        }}>
        {encryptionAddress(transferItem.txHash)}
      </TableTxidContent>
      <TableStatus>
        <StatusItem className={showTransferStatus(transferItem)}>
          {showTransferStatus(transferItem)}
        </StatusItem>
      </TableStatus>
    </TableRow>
  ) : (
    <MobileTableItem
      onClick={() => {
        clickHistoryTxid(transferItem)
      }}>
      <MobileTableItemLeft>
        <img
          src={findChainFromToken(transferItem.currencyId)?.tokenIconUrl}
          alt=""
        />
        <MobileTableItemLeftInfo>
          <MobileTableCoinName>
            {findChainFromToken(transferItem.currencyId)?.name}
            <div>
              <span>
                {
                  findNetworks({
                    layerTwoChainId: transferItem?.chainId as number,
                  })?.name
                }
              </span>
            </div>
          </MobileTableCoinName>
          <MobileTableCoinTime>
            {dayjs(transferItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </MobileTableCoinTime>
        </MobileTableItemLeftInfo>
      </MobileTableItemLeft>
      <MobileTableItemRight>
        <MobileTableItemAmount>
          <span>{transferItem.amount}</span>
        </MobileTableItemAmount>
        <MobileTableItemTxid>
          <span>{encryptionAddress(transferItem.txHash)}</span>
        </MobileTableItemTxid>
        <StatusItem className={showTransferStatus(transferItem)}>
          {showTransferStatus(transferItem)}
        </StatusItem>
      </MobileTableItemRight>
    </MobileTableItem>
  )
})
