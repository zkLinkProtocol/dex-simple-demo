import { ApiHistoryItem } from 'api/v1/txHistory'
import Loading from 'components/Loading'
import dayjs from 'dayjs'
import useResize from 'hooks/useResize'
import { FC, memo } from 'react'
import { findNetworks, useSpotCurrencies } from 'store/app/hooks'
import { useDepositStatus } from 'store/deposit/hook'
import { DepositETHTransaction, DepositStatus } from 'store/deposit/types'
import { TokenId } from 'types'
import { encryptionAddress } from 'utils/address'
import { viewOnExplorer } from 'utils/explorer'
import { parseWeiToEther } from 'utils/number'
import { DateFormatter } from '../../utils/datetime'
import {
  MobileTableCoinName,
  MobileTableCoinTime,
  MobileTableItem,
  MobileTableItemAmount,
  MobileTableItemLeft,
  MobileTableItemLeftInfo,
  MobileTableItemRight,
  StatusItem,
  TableAmount,
  TableAssetContent,
  TableDateContent,
  TableId,
  TableRow,
  TableStatus,
  TableTxidContent,
} from './style'

export const DepositRow: FC<{
  depositItem: ApiHistoryItem | DepositETHTransaction
}> = memo(({ depositItem }) => {
  const tokens = useSpotCurrencies()
  const { ethHash = '', chainId = 0 } = depositItem // ethHash is existed in deposit history
  const status: DepositStatus = useDepositStatus(ethHash)
  const { isMobile } = useResize()

  const findChainFromToken = (tokenId: TokenId) => {
    return tokens.find((withdrawItem) => withdrawItem.id === tokenId)
  }
  const clickHistoryEthHash = () => {
    viewOnExplorer(
      {
        layerTwoChainId: chainId,
      },
      ethHash
    )
  }

  const statusText =
    status >= DepositStatus.ZkLinkConfirmed ? 'Success' : 'Pending'

  return !isMobile ? (
    <TableRow>
      <TableDateContent>
        {DateFormatter.toISODateTime(depositItem.createdAt)}
      </TableDateContent>
      <TableId>{findNetworks({ layerTwoChainId: chainId })?.name}</TableId>
      <TableAmount>
        {(depositItem as DepositETHTransaction).tx
          ? parseWeiToEther(depositItem.amount + '')
          : depositItem.amount}
      </TableAmount>
      <TableAssetContent>
        {/* <img src={findChainFromToken(depositItem.l2Token)?.currencyIcon} /> */}
        {findChainFromToken(depositItem.currencyId)?.name}
      </TableAssetContent>
      <TableTxidContent
        onClick={() => {
          clickHistoryEthHash()
        }}>
        {encryptionAddress(ethHash)}
      </TableTxidContent>
      <TableStatus>
        <StatusItem className={statusText}>
          {status === DepositStatus.Loading ? <Loading /> : statusText}
        </StatusItem>
      </TableStatus>
    </TableRow>
  ) : (
    <MobileTableItem
      onClick={() => {
        clickHistoryEthHash()
      }}>
      <MobileTableItemLeft>
        <img
          src={findChainFromToken(depositItem.currencyId)?.tokenIconUrl}
          alt=""
        />
        <MobileTableItemLeftInfo>
          <MobileTableCoinName>
            {findChainFromToken(depositItem.currencyId)?.name}
            <div>
              <span>{findNetworks({ layerTwoChainId: chainId })?.name}</span>
            </div>
          </MobileTableCoinName>
          <MobileTableCoinTime>
            {dayjs(depositItem.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </MobileTableCoinTime>
        </MobileTableItemLeftInfo>
      </MobileTableItemLeft>
      <MobileTableItemRight>
        <MobileTableItemAmount>
          <span>
            {(depositItem as DepositETHTransaction).tx
              ? parseWeiToEther(depositItem.amount + '')
              : depositItem.amount}
          </span>
        </MobileTableItemAmount>
        <StatusItem className={statusText}>
          {status === DepositStatus.Loading ? <Loading /> : statusText}
        </StatusItem>
      </MobileTableItemRight>
    </MobileTableItem>
  )
})
