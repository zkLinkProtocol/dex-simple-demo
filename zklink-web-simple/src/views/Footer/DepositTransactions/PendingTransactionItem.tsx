import { Stack, styled, Tooltip, Typography } from '@mui/material'
import Iconfont from 'components/Iconfont'
import { DefaultDepositConfirmations } from 'config/deposit'
import dayjs from 'dayjs'
import { memo } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch } from 'store'
import { findNetworks, useCurrencyByName } from 'store/app/hooks'
import { removeMatchedDepositPendingTxAction } from 'store/deposit/actions'
import {
  getDepositsEstimateMinutes,
  useDepositStatus,
  useTxConfirmationsByHash,
} from 'store/deposit/hook'
import { DepositETHTransaction, DepositStatus } from 'store/deposit/types'
import { transientOptions } from 'styles/TransientOptions'
import { encryptionAddress } from 'utils/address'
import { getExplorerUrl } from 'utils/explorer'
import { w2e } from 'utils/number'

const Wrap = styled(Stack)`
  gap: 8px;
  color: ${(props) => props.theme.color.text90};
  padding: 12px 12px 0;
  background-color: ${(props) => props.theme.color.bgLightGray};
  border-radius: 4px;
  position: relative;

  a {
    color: ${(props) => props.theme.color.notificationBlue02};
  }
`

const CurrencyAmount = styled(Typography)`
  font-size: 14px;
  line-height: 1;
  font-weight: 500;
`
const CurrencyIcon = styled('img')`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 8px;
  flex-shrink: 0;
  background-color: ${(props) => props.theme.color.bg};
`
const EstTime = styled(Typography)`
  font-size: 12px;
  line-height: 1;
  color: ${(props) => props.theme.color.text50};
`

const DeleteButton = styled(Stack)`
  justify-content: center;
  align-self: flex-start;
  font-size: 16px;
  cursor: pointer;
  padding: 0 8px;
  margin-right: -8px;
  :hover {
    color: ${(props) => props.theme.palette.error.main};
  }
`

const Confirmations = styled(Stack)`
  flex-direction: row;
  align-items: center;
  line-height: 1;
  gap: 3px;
  color: ${(props) => props.theme.palette.primary.main};

  &::before {
    content: '';
    display: block;
    width: 4px;
    height: 4px;
    border-radius: 2px;
    background-color: ${(props) => props.theme.palette.primary.main};
  }
`

const Progress = styled('div', transientOptions)<{
  $progress?: number
}>`
  height: 6px;
  background-color: ${(props) => props.theme.color.text40};
  margin: 0 -12px;
  border-radius: 0 0 4px 4px;
  overflow: hidden;

  &::after {
    display: block;
    content: '';
    width: ${(props) => props.$progress}%;
    height: 100%;
    background-color: ${(props) => props.theme.palette.primary.main};
    transition: width 0.3s ease-in-out;
  }
`

const progress: Record<
  | DepositStatus.BlockPending
  | DepositStatus.BlockConfirmations
  | DepositStatus.BlockConfirmed
  | DepositStatus.ZkLinkConfirmed
  | number,
  number
> = {
  [DepositStatus.BlockConfirmations]: 33,
  [DepositStatus.BlockConfirmed]: 66,
  [DepositStatus.ZkLinkConfirmed]: 100,
}

const getStatusText = (
  status: DepositStatus,
  confirmations: number,
  networkConfirmations: number
) => {
  switch (status) {
    case DepositStatus.BlockConfirmations:
      return `Wait Confirmations (${confirmations}/${networkConfirmations})`
    case DepositStatus.BlockConfirmed:
      return 'Block Confirmed'
    case DepositStatus.ZkLinkConfirmed:
      return 'ZKLink Confirmed'
    default:
      return (
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>Checking</span>
        </Stack>
      )
  }
}

export const PendingTransactionItem = memo<{ item: DepositETHTransaction }>(
  ({ item }) => {
    const dispatch = useAppDispatch()
    const {
      layerOneChainId = 0,
      amount = '',
      tokenSymbol = '',
      ethHash = '',
      createdAt = 0,
    } = item
    const { tokenIconUrl = '' } = useCurrencyByName(tokenSymbol) ?? {}
    const estimateMinutes = getDepositsEstimateMinutes(layerOneChainId)

    const arrivalTime = createdAt + estimateMinutes * 60 * 1000
    const millisecondTime = arrivalTime - dayjs().valueOf()

    const confirmations = useTxConfirmationsByHash(ethHash)
    const networkConfirmations =
      findNetworks({
        layerOneChainId,
      })?.depositConfirmation ?? DefaultDepositConfirmations

    let afterMinutes: number
    if (millisecondTime < 0) {
      afterMinutes = 0
    } else {
      afterMinutes = Math.ceil(millisecondTime / 1000 / 60)
    }

    const explorerUrl =
      getExplorerUrl({ layerOneChainId: layerOneChainId }, ethHash) ?? ''

    const status = useDepositStatus(ethHash)

    return (
      <Wrap>
        <Stack alignItems="center" direction="row">
          <CurrencyIcon src={tokenIconUrl} />
          <Stack flex={1} spacing={0.25}>
            <CurrencyAmount>
              {w2e(amount)} {tokenSymbol}
            </CurrencyAmount>
            <div>
              <Link to={explorerUrl} target="_blank">
                {encryptionAddress(ethHash)}
              </Link>
            </div>
          </Stack>

          <Tooltip
            arrow
            placement="top"
            title="Not your transaction? Deleting it here won't affect the blockchain.">
            <DeleteButton
              onClick={() => {
                dispatch(removeMatchedDepositPendingTxAction([ethHash]))
              }}>
              <Iconfont name="icon-cancel" size={16} />
            </DeleteButton>
          </Tooltip>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between">
          <Confirmations>
            {getStatusText(status, confirmations, networkConfirmations)}
          </Confirmations>
          {status === DepositStatus.ZkLinkConfirmed ? (
            <EstTime>Funds Received</EstTime>
          ) : (
            <Tooltip
              arrow
              placement="top"
              title={
                afterMinutes > 0
                  ? ''
                  : 'Funds not arrived yet? The estimated time is based on ideal conditions and may vary.'
              }>
              <EstTime>Est. ~{afterMinutes} minutes remaining</EstTime>
            </Tooltip>
          )}
        </Stack>
        <Progress $progress={progress[status] ?? 0}></Progress>
      </Wrap>
    )
  }
)
