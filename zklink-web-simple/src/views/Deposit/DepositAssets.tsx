import { Stack, styled } from '@mui/material'
import { Currency } from 'api/v3/tokens'
import Loading from 'components/Loading'
import { formatUnits } from 'ethers/lib/utils'
import { useFetchEthereumBalance } from 'hooks/wallet/useEthereumBalanceOf'
import { memo, useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useActionState, useCurrentNetwork } from 'store/app/hooks'
import { updateDepositTokenAction } from 'store/deposit/actions'
import { useDepositToken, useTokenListOnDeposit } from 'store/deposit/hook'
import { useEthereumTokenBalance, useEthereumTokenInfo } from 'store/link/hooks'
import { toFixed } from 'utils/number'

const DepositAssetsWrap = styled(Stack)`
  max-height: 132px;
  gap: 4px;
  padding: 8px;
  background-color: ${(props) => props.theme.color.bg};
  border-radius: 4px;
  overflow-y: auto;
`
const AssetsItemWrap = styled(Stack)`
  flex-direction: row;
  align-items: center;
  height: 36px;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 14px;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &.active,
  &:hover {
    background-color: ${(props) => props.theme.color.bgLightGray};
    cursor: pointer;
  }

  &.active {
    border: 1px solid rgba(3, 212, 152, 0.5);
  }
`
const AssetsIcon = styled('img')`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`
const AssetsSymbol = styled('div')`
  flex: 1;
  font-weight: 600;
  color: ${(props) => props.theme.color.text90};
`
const AssetsAvailable = styled(Stack)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  color: ${(props) => props.theme.color.text30};
`
export const DepositAssets = memo(() => {
  const { layerOneChainId } = useCurrentNetwork()
  const supportTokens = useTokenListOnDeposit(layerOneChainId)

  useFetchEthereumBalance(layerOneChainId)

  return (
    <DepositAssetsWrap>
      {supportTokens.map((currency) => (
        <AssetsItem key={currency?.id} currency={currency} />
      ))}
    </DepositAssetsWrap>
  )
})

const AssetsItem = memo<{
  currency: Currency
}>(({ currency }) => {
  const { layerOneChainId } = useCurrentNetwork()
  const { id, l2CurrencyId, name, tokenIconUrl } = currency
  const dispatch = useDispatch()
  const selectedToken = useDepositToken()
  const balancesPulling = useActionState('ethereumBalancesPulling')
  const balance = useEthereumTokenBalance(layerOneChainId, l2CurrencyId)

  const { decimals = 0 } =
    useEthereumTokenInfo(layerOneChainId, l2CurrencyId) ?? {}

  const available = useMemo(() => {
    if (!balance) {
      return '0'
    }
    return toFixed(formatUnits(balance, decimals), 5)
  }, [balance, decimals])

  const onClickToken = useCallback((selectedToken: Currency) => {
    dispatch(updateDepositTokenAction(selectedToken))
  }, [])

  const classes = selectedToken?.id === id ? 'active' : null

  return (
    <AssetsItemWrap
      className={`${classes}`}
      onClick={() => onClickToken(currency)}>
      <AssetsIcon src={tokenIconUrl} />
      <AssetsSymbol>{name}</AssetsSymbol>
      <AssetsAvailable>
        {balancesPulling ? <Loading size={12} /> : null}
        <span>Available: {available}</span>
      </AssetsAvailable>
    </AssetsItemWrap>
  )
})
