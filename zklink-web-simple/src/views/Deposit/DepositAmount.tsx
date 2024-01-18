import { styled } from '@mui/material'
import InputAmount, { Input } from 'components/InputAmount'
import { formatUnits } from 'ethers/lib/utils'
import { memo, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { useCurrentNetwork } from 'store/app/hooks'
import { updateDepositAmountAction } from 'store/deposit/actions'
import { useDepositAmount, useDepositToken } from 'store/deposit/hook'
import { useEthereumTokenBalance, useEthereumTokenInfo } from 'store/link/hooks'
import { Ether } from 'types'

export const StyledInputAmount = styled(Input)`
  flex: 1;
  height: 100%;
  text-align: left;
  padding: 0 12px 0 0;
  outline: none !important;
  border-color: none !important;
  box-shadow: none !important;
  color: #1c1f27;
`
export const InputAmountRow = styled('div')`
  display: flex;
  align-items: center;
  line-height: 16px;
  padding: 0 12px;
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border: none;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.color.bg};
  height: 48px;
  color: ${(props) => props.theme.color.text70};
  font-size: 14px;
  position: relative;
`
export const Max = styled('div')`
  line-height: 24px;
  color: ${(props) => props.theme.color.text90};
  padding: 0 12px;
  cursor: pointer;
  background: rgba(3, 212, 152, 0.5);
  border-radius: 2px;
`
export const DepositAmount = memo(() => {
  const dispatch = useDispatch()
  const { layerOneChainId } = useCurrentNetwork()
  const amount = useDepositAmount()
  const { t } = useTranslation()
  const { l2CurrencyId = 0 } = useDepositToken() ?? {}
  const { decimals = 0 } =
    useEthereumTokenInfo(layerOneChainId, l2CurrencyId) ?? {}
  const balance = useEthereumTokenBalance(layerOneChainId, l2CurrencyId)

  const available = useMemo(() => {
    if (!balance || !decimals) {
      return '0'
    }
    return formatUnits(balance, decimals)
  }, [balance, decimals])

  const onInputAmount = useCallback((amount: Ether) => {
    dispatch(updateDepositAmountAction(amount))
  }, [])

  return (
    <InputAmountRow>
      <InputAmount
        as={StyledInputAmount}
        value={amount}
        placeholder={`Enter amount...`}
        onInput={onInputAmount}
      />
      <Max
        onClick={() => {
          dispatch(updateDepositAmountAction(available))
        }}>
        {t('deposit-max', {
          defaultValue: 'MAX',
        })}
      </Max>
    </InputAmountRow>
  )
})
