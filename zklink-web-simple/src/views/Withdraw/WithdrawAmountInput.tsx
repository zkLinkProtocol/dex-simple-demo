import { ChainInfo } from 'api/v3/chains'
import InputAmount from 'components/InputAmount'
import { BigNumber } from 'ethers'
import i18n from 'i18n'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateAmount } from 'store/withdraw/actions'
import {
  useAmount,
  useSelectedToken,
  useWithdrawLayoutType,
  useWithdrawLimitByToken,
} from 'store/withdraw/hook'
import { WithdrawLayoutType } from 'store/withdraw/types'
import { inputAmount } from 'utils/amount'
import { parseWeiToEther, toFixed, w2e } from 'utils/number'
import {
  Max,
  StyledInputAmount,
  TokenRowInputEle,
} from '../Deposit/DepositSelectAssets'
import { FromTip, HeaderTipValue } from './style'

const WithdrawAmountInput: FC<{
  l2Balance: string
  formatBalance: (balance: string | BigNumber) => string
  selectedNetwork?: ChainInfo
}> = memo(({ l2Balance, selectedNetwork, formatBalance }) => {
  const layoutType = useWithdrawLayoutType()
  const amount = useAmount()
  const dispatch = useDispatch()
  const selectedToken = useSelectedToken()
  const [limitSize] = useWithdrawLimitByToken(selectedToken?.l2CurrencyId!)

  const limit = selectedNetwork?.layerTwoChainId
    ? limitSize[selectedNetwork?.layerTwoChainId] ?? '0'
    : '0'
  return (
    <>
      <HeaderTipValue>
        <FromTip>
          {layoutType === WithdrawLayoutType.Withdraw &&
            `${i18n.t('current-withdraw-nexus-limit')} ${toFixed(
              w2e(limit as string),
              6
            )}`}
        </FromTip>
        <FromTip>
          Available: {formatBalance(l2Balance)} {selectedToken?.name}
        </FromTip>
      </HeaderTipValue>
      <TokenRowInputEle>
        <InputAmount
          as={StyledInputAmount}
          value={amount}
          placeholder={`Enter amount...`}
          onInput={(a) => {
            if (a) {
              dispatch(updateAmount(inputAmount(a)))
            } else {
              dispatch(updateAmount(''))
            }
          }}
        />
        <Max
          onClick={() => {
            dispatch(updateAmount(parseWeiToEther(l2Balance)))
          }}>
          {i18n.t('deposit-max', { defaultValue: 'MAX' })}
        </Max>
      </TokenRowInputEle>
    </>
  )
})
export default WithdrawAmountInput
