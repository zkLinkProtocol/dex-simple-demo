import { styled } from '@mui/material'
import { BigNumber } from 'ethers'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrencyBalance } from 'store/account/hooks'
import { useDepositAmount, useDepositToken } from 'store/deposit/hook'
import { Space4 } from 'styles'
import { parseWeiToEther, toFixed } from 'utils/number'
import { isUSDStableCoins } from 'utils/tokens'
import { InputAmountRow } from './DepositAmount'
import { GrayBgContent, HeaderTip } from './DepositContent'
const FromTip = styled('div')`
  color: ${(props) => props.theme.color.text70};
`
export const ReceiveWrap = styled('div')`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  color: ${(props) => props.theme.color.text70};
  .left {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }
  .right {
    font-weight: 400;
    font-size: 16px;
    line-height: 24px;
    /* identical to box height, or 150% */
    text-align: right;
  }
`

export const DepositReceive = memo(() => {
  const { t } = useTranslation()
  const amount = useDepositAmount()
  const selectedToken = useDepositToken()
  const l2Balance = useCurrencyBalance(selectedToken?.name!)?.available ?? ''

  const formatBalance = (balance: string | BigNumber): string => {
    let amount: string = parseWeiToEther(balance, 2)
    return amount
  }

  return (
    <GrayBgContent>
      <HeaderTip>
        <FromTip>
          <strong>
            {t('deposit-to', {
              defaultValue: 'To',
            })}
          </strong>{' '}
          {t('deposit-zklink-wallet')}
        </FromTip>
        <div>
          {t('deposit-balance', {
            defaultValue: 'Balance',
          })}
          : {formatBalance(l2Balance)}{' '}
          {isUSDStableCoins(selectedToken?.id!) ? 'USD' : selectedToken?.name}
        </div>
      </HeaderTip>
      <Space4 />
      <InputAmountRow>
        <ReceiveWrap>
          <span className="left">
            {t('deposit-receive', {
              defaultValue: 'You will receive',
            })}
          </span>
          <span className="right">
            {toFixed(amount)} {selectedToken?.name}
          </span>
        </ReceiveWrap>
      </InputAmountRow>
    </GrayBgContent>
  )
})
