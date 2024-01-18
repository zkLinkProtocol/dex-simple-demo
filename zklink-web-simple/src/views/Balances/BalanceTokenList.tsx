import { styled } from '@mui/material'
import { FC, memo, useMemo } from 'react'
import { useAccountBalances } from 'store/account/hooks'
import { CurrencyBalance } from 'store/account/reducer'
import {
  useCurrencies,
  useCurrencyByName,
  useCurrencyClosePrice,
} from 'store/app/hooks'
import { useShowBalanceInfo } from 'store/settings/hooks'
import { Flex, FlexCenter } from 'styles'
import { bn, e2w, toFixed, toGrouping, w2e } from 'utils/number'

const SectionList = styled('div')`
  ${(props) => props.theme.breakpoints.up('md')} {
    flex: 1;
    overflow: auto;
    max-height: 600px;
  }
`
const SectionListItem = styled(FlexCenter)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
  padding: 10px 8px;
  cursor: pointer;
  color: ${(props) => props.theme.color.text90};
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 58px;
  }
`
const BalanceItemWrap = styled('div')`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  .black {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.color.text90};
    ${(props) => props.theme.breakpoints.down('md')} {
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
    }
  }
  .gray {
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    color: ${(props) => props.theme.color.text50};
    ${(props) => props.theme.breakpoints.down('md')} {
      font-weight: 600;
      font-size: 14px;
      line-height: 24px;
    }
  }
`
const CoinIcon = styled('img')`
  display: flex;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 32px;
    height: 32px;
  }
`
const CoinInfo = styled(Flex)`
  align-items: center;
`
const CoinInfoCosts = styled('div')`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: flex-end;
  flex: 1;

  overflow: hidden;
  .buy,
  .sell {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    justify-content: flex-end;
  }
`

const CoinName = styled('div')`
  display: flex;
  flex-direction: column;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  margin-left: 6px;
  justify-content: center;
  color: ${(props) => props.theme.color.text50};
  .black {
    font-weight: 600;
    font-size: 14px;
    line-height: 16px;
    color: ${(props) => props.theme.color.text90};
  }
`
const CoinInfoWrap = styled('div')`
  line-height: 16px;
  text-align: right;
  color: #767e9c;
  &.black {
    font-weight: 600;
    font-size: 14px;
    color: ${(props) => props.theme.color.text90};
  }
  &.gray {
    font-weight: 400;
    font-size: 12px;
    color: ${(props) => props.theme.color.text50};
  }
`
const HideWrap = styled(FlexCenter)``

const BalanceItem: FC<{
  item: CurrencyBalance
}> = memo(({ item }) => {
  const { available, currency: symbol } = item
  const price = useCurrencyClosePrice(symbol)
  const currency = useCurrencyByName(symbol)
  const { tokenIconUrl = '', displayName = '' } = currency ?? {}
  const showBalanceInfo = useShowBalanceInfo()

  const value = useMemo(() => {
    return w2e(bn(available).mul(e2w(price)))
  }, [available, price])

  return (
    <SectionListItem>
      <BalanceItemWrap>
        <CoinInfo>
          <CoinIcon src={tokenIconUrl} />
          <CoinName>
            <span className="black">{item.currency}</span>
            <span>{displayName}</span>
          </CoinName>
        </CoinInfo>
        {showBalanceInfo ? (
          <CoinInfoCosts>
            <CoinInfoWrap className="black">
              {toFixed(w2e(item.available), 8, { fixed: true })}
            </CoinInfoWrap>
            <CoinInfoWrap className="gray">
              {price ? `$${toGrouping(w2e(value))}` : '-'}
            </CoinInfoWrap>
          </CoinInfoCosts>
        ) : (
          <HideWrap>********</HideWrap>
        )}
      </BalanceItemWrap>
    </SectionListItem>
  )
})

export const BalanceTokenList = memo(() => {
  const balances = useAccountBalances()
  const currencies = useCurrencies()
  const zeroSymbol = useMemo(() => {
    const _balances = balances.map((item) => item.currency)
    return currencies.filter((item) => !_balances.includes(item.name))
  }, [currencies, balances])
  return (
    <SectionList>
      {balances.map((item) => {
        return <BalanceItem key={item.currency} item={item} />
      })}
      {zeroSymbol.map((item) => {
        return (
          <BalanceItem
            key={item.name}
            item={{
              currencyId: 0,
              main: false,
              currency: item.name,
              available: '0',
              freeze: '0',
            }}
          />
        )
      })}
    </SectionList>
  )
})
