import Loading from 'components/Loading'
import { BigNumber } from 'ethers'
import { formatEther } from 'ethers/lib/utils'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelectFast, useSelectedToken } from 'store/withdraw/hook'
import { Space4, Wing10 } from 'styles'
import { parseWeiToEther } from 'utils/number'
import {
  FeeWrap,
  GrayBgContent,
  ReceiveWrap,
  TokenRowInputEle,
} from '../Deposit/DepositSelectAssets'

const WithdrawReceive = memo<{
  receiveAmount: BigNumber | undefined
  commissionFee: BigNumber | undefined
  fastFee: BigNumber | null
  pending: boolean
}>(({ receiveAmount, commissionFee, fastFee, pending }) => {
  const selectedToken = useSelectedToken()
  const { t } = useTranslation()
  const selectFast = useSelectFast()

  return (
    <GrayBgContent>
      <Space4 />
      <TokenRowInputEle>
        <ReceiveWrap>
          <span className="left">{t('deposit-receive')}</span>
          <span className="right">
            {parseWeiToEther(receiveAmount!)} {selectedToken?.name}
          </span>
        </ReceiveWrap>
      </TokenRowInputEle>
      <FeeWrap>
        <span>{t('withdraw-commission-fee')}:</span>
        {pending ? (
          <Loading size={12} />
        ) : (
          <span>{commissionFee ? formatEther(commissionFee) : '0'}</span>
        )}
        <span>{selectedToken?.name}</span>
        {selectFast ? (
          <>
            <Wing10>+</Wing10>
            Fast Fee: {fastFee ? formatEther(fastFee) : '0'}{' '}
            {selectedToken?.name}
          </>
        ) : null}
      </FeeWrap>
    </GrayBgContent>
  )
})
export default WithdrawReceive
