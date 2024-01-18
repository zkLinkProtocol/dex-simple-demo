import { TransactionHistoryDetail } from 'api/v3/getAccountTransactionHistory'
import { memo } from 'react'
import { useCurrencyById } from 'store/app/hooks'
import { FlexAlignCenter, FlexItem } from 'styles'
import { encryptionAddress } from 'utils/address'
import { DateFormatter } from 'utils/datetime'
import { viewOnZKLinkExplorer } from 'utils/explorer'
import { w2e } from 'utils/number'
import { ReactComponent as FastIcon } from '../../components/SelecteTokenAndNetwork/fast.svg'
import Chain from './Chain'
import {
  AddressText,
  ItemWrap,
  RightColumn,
  TimeText,
  TokenText,
  ValueText,
} from './styles'

export const TransactionItem = memo<{ item: TransactionHistoryDetail }>(
  ({ item }) => {
    const { txHash, createdAt, amount, tx } = item
    const token = useCurrencyById({ id: tx.l1TargetToken })
    return (
      <ItemWrap>
        <FlexItem className="item-left">
          <FlexAlignCenter>
            <AddressText onClick={() => viewOnZKLinkExplorer(txHash)}>
              {encryptionAddress(txHash) || '-'}
            </AddressText>
          </FlexAlignCenter>
          <TimeText>{DateFormatter.toISODateTime(createdAt)}</TimeText>
        </FlexItem>
        <TokenText>
          {tx.withdrawFeeRatio > 0 ? <FastIcon /> : null}
          {w2e(amount)} {token?.name}
        </TokenText>
        <RightColumn>
          <FlexAlignCenter sx={{ gap: '4px' }}>
            <ValueText>To </ValueText>
            <AddressText onClick={() => viewOnZKLinkExplorer(tx.to)}>
              {encryptionAddress(tx.to)}
            </AddressText>
          </FlexAlignCenter>
          <Chain chainId={tx.toChainId + ''} />
        </RightColumn>
      </ItemWrap>
    )
  }
)
