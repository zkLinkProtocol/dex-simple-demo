import { ChainInfo } from 'api/v3/chains'
import SelectTokenAndNetwork from 'components/SelecteTokenAndNetwork'
import toastify from 'components/Toastify'
import { MainnetChainIds } from 'config/chains'
import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import i18n from 'i18n'
import { atom, useAtom } from 'jotai'
import { FC, memo, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'store'
import { useAvailableBalance } from 'store/app/hooks'
import { useTransfer } from 'store/transfer/hooks'
import {
  fetchWithdrawalTransactions,
  updateAmount,
  updateSelectFast,
  updateShowAddressBookList,
  updateWithdrawing,
} from 'store/withdraw/actions'
import {
  useAmount,
  useBrokerLimit,
  useSelectFast,
  useSelectedToken,
  useWithdraw,
  useWithdrawAddress,
  useWithdrawFee,
  useWithdrawLayoutType,
} from 'store/withdraw/hook'
import { WithdrawLayoutType } from 'store/withdraw/types'
import { ContentWrap, Space12, Space16, Space24, Space4 } from 'styles'
import { useOnClickOutside } from 'usehooks-ts'
import { computeReceiveAmount } from 'utils/amount'
import { improveDecimals } from 'utils/decimals'
import {
  fastWithdrawFeeRatioToAmount,
  fastWithdrawTieredRates,
} from 'utils/fastWithdrawFee'
import { GaEventName, gaEvent } from 'utils/ga'
import { bn, e2w, parseWeiToEther } from 'utils/number'
import { getTokenDecimals } from 'utils/tokens'
import {
  useActivateAccount,
  useActivating,
  useIsInactivated,
} from '../../store/account/hooks'
import { GrayBgContent } from '../Deposit/DepositSelectAssets'
import WithdrawAddressInput from './WithdrawAddressInput'
import WithdrawAmountInput from './WithdrawAmountInput'
import WithdrawBtn from './WithdrawButton'
import WithdrawReceive from './WithdrawReceive'
import WithdrawSpeed from './WithdrawSpeed'
import WithdrawTokenAndNetwork from './WithdrawTokenAndNetwork'
import { FromTip, WithdrawSelectWrap } from './style'

export const withdrawSelectNet = atom<ChainInfo | undefined>(undefined)

const WithdrawMain: FC<{
  myAddress: string
}> = memo(({ myAddress }) => {
  const layoutType = useWithdrawLayoutType()
  const amount = useAmount()
  const address = useWithdrawAddress()
  const selectedToken = useSelectedToken()
  const selectFast = useSelectFast()
  const [selectedNetwork, setSelectedNetwork] = useAtom(withdrawSelectNet)
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const withdraw = useWithdraw()
  const transfer = useTransfer()
  const available = useAvailableBalance(selectedToken?.name!)
  const AddressBookIconRef = useRef<any>()
  const isInactivated = useIsInactivated()
  const activating = useActivating()
  const activateAccount = useActivateAccount()

  const decimals = getTokenDecimals(
    selectedToken!,
    selectedNetwork?.layerTwoChainId!
  )

  const brokerInfo = useBrokerLimit(
    selectedNetwork?.layerOneChainId!,
    selectedToken?.id!
  )

  const { fee: maxBrokerFee = 0, available: sourceBrokerLimit = 0 } =
    brokerInfo || {}
  const brokerLimit = useMemo(() => {
    if (!sourceBrokerLimit) {
      return '0'
    }

    return improveDecimals(bn(sourceBrokerLimit), decimals).toString()
  }, [decimals, sourceBrokerLimit])

  const brokerFeeRatio = useMemo(() => {
    if (
      selectedNetwork?.layerOneChainId === MainnetChainIds.Arbitrum ||
      selectedNetwork?.layerOneChainId === MainnetChainIds.Optimism
    ) {
      return 100
    }
    return fastWithdrawTieredRates(e2w(amount), brokerLimit, maxBrokerFee)
  }, [amount, maxBrokerFee, brokerLimit, selectedNetwork?.layerOneChainId])

  const selectedTokenChain = useMemo(() => {
    if (selectedNetwork?.layerTwoChainId) {
      return selectedToken?.chains?.[selectedNetwork.layerTwoChainId]
    }
    return undefined
  }, [selectedToken, selectedNetwork])

  useEffect(() => {
    dispatch(updateSelectFast(!!selectedTokenChain?.fastWithdraw))
  }, [selectedToken])

  useOnClickOutside(AddressBookIconRef, () =>
    dispatch(updateShowAddressBookList(false))
  )

  const formatBalance = (balance: string | BigNumber): string => {
    return parseWeiToEther(balance, 2)
  }
  const [withdrawFee, withdrawFeePending] = useWithdrawFee(
    selectedNetwork?.layerOneChainId!,
    selectedToken?.id!
  )

  const fee = withdrawFee

  const canWithdrawAmount = useMemo(() => {
    if (!fee) {
      return BigNumber.from('0')
    }
    return computeReceiveAmount(e2w(amount), fee, BigNumber.from(available))
  }, [amount, available, fee])

  const fastFee = useMemo(() => {
    if (!canWithdrawAmount || canWithdrawAmount.isZero()) {
      return bn('0')
    }
    return fastWithdrawFeeRatioToAmount(canWithdrawAmount, brokerFeeRatio)
  }, [canWithdrawAmount, brokerFeeRatio])

  const receiveAmount: BigNumber | undefined = useMemo(() => {
    if (selectFast) {
      return canWithdrawAmount?.sub(fastFee)
    } else {
      return canWithdrawAmount
    }
  }, [canWithdrawAmount, fastFee, selectFast])

  const withdrawSubmit = async () => {
    withdraw({
      withdrawTo: address,
      layerOneChainId: selectedNetwork?.layerOneChainId!,
      tokenId: selectedToken?.l2CurrencyId!,
      tokenSymbol: selectedToken?.l2Symbol!,
      amount: canWithdrawAmount,
      fastWithdraw: selectFast ? 1 : 0,
      withdrawFeeRatio: selectFast ? brokerFeeRatio : 0,
      fee,
    } as any)
      .then(() => {
        dispatch(updateAmount(''))
        dispatch(fetchWithdrawalTransactions({ page: 0, pageSize: 10 }))
      })
      .finally(() => {
        dispatch(updateWithdrawing(false))
      })

    gaEvent(GaEventName.request_withdraw, {
      symbol: selectedToken?.name!,
    })
  }

  const sendWithdraw = async () => {
    // layerNum = 1  to layer1
    // layerNum = 2  to layer2
    if (!address) {
      toastify.warn(
        `${t('common-enter-address', {
          defaultValue: 'Please enter the withdrawal address.',
        })}`
      )
      return
    }
    if (!isAddress(address)) {
      toastify.warn(
        `${t('common-wrong-address', {
          defaultValue:
            'There is a problem with the withdrawal address. Please check and enter it again.',
        })}`
      )
      return
    }
    if (!Number(amount)) {
      toastify.warn(
        `${t('common-enter-amount', {
          defaultValue: 'Please enter the amount you want to withdraw.',
        })}`
      )
      return
    }

    if (!canWithdrawAmount) {
      return
    }

    if (!fee) {
      return
    }

    if (receiveAmount?.lte(0)) {
      toastify.warn('Not enough balance to cover the withdrawal fee.')
      return
    }

    if (selectFast && !brokerInfo) {
      toastify.warn(
        "Initialization of the acceptor's information failed. Please wait or refresh and try again."
      )
      return
    }

    if (isInactivated && !activating) {
      const activeStatus = await activateAccount()
      const { isActivate } = activeStatus
      if (isActivate) {
        withdrawSubmit()
      }
      return
    }

    withdrawSubmit()
  }

  return (
    <ContentWrap>
      <WithdrawSelectWrap>
        <GrayBgContent>
          <FromTip>
            {i18n.t('withdraw-destination', { defaultValue: 'Destination' })}
          </FromTip>
          <Space4 />
          {/* address input */}
          <WithdrawAddressInput
            myAddress={myAddress}
            AddressBookIconRef={AddressBookIconRef}
          />

          <Space12 />
          {/* select token and select network */}
          {layoutType === WithdrawLayoutType.Transfer ? (
            <WithdrawTokenAndNetwork
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          ) : (
            <SelectTokenAndNetwork
              showSupportFast={true}
              selectedNetwork={selectedNetwork}
              setSelectedNetwork={setSelectedNetwork}
            />
          )}

          {/* amount input */}
          <WithdrawAmountInput
            l2Balance={available}
            formatBalance={formatBalance}
            selectedNetwork={selectedNetwork}
          />
        </GrayBgContent>
        <Space16 />
        {/* Withdrawal Speed Options */}
        {layoutType === WithdrawLayoutType.Withdraw && (
          <WithdrawSpeed selectedNetwork={selectedNetwork} />
        )}

        {/* Receive  */}
        <WithdrawReceive
          receiveAmount={receiveAmount}
          fastFee={fastFee}
          commissionFee={fee}
          pending={withdrawFeePending}
        />
        <Space24 />
        {/* withdraw button */}
        <WithdrawBtn
          l2Balance={available}
          fee={fee}
          brokerLimit={brokerLimit}
          sendWithdraw={sendWithdraw}
          selectedNetwork={selectedNetwork}
        />
      </WithdrawSelectWrap>
    </ContentWrap>
  )
})
export default WithdrawMain
