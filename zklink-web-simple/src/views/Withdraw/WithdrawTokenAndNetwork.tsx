import { ChainInfo } from 'api/v3/chains'
import { Currency } from 'api/v3/tokens'
import { SelectNetwork } from 'components/SelectNetwork'
import { SelectToken } from 'components/SelectToken'
import { Dispatch, FC, SetStateAction, memo, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSpotCurrencies } from 'store/app/hooks'
import { updateAmount, updateSelectedToken } from 'store/withdraw/actions'
import { useSelectedToken, useWithdrawLayoutType } from 'store/withdraw/hook'
import { WithdrawLayoutType } from 'store/withdraw/types'
import { SelectTokenAndNetworkWrap } from '../Deposit/DepositSelectAssets'

const WithdrawTokenAndNetwork: FC<{
  selectedNetwork: ChainInfo | undefined
  setSelectedNetwork: Dispatch<SetStateAction<ChainInfo | undefined>>
}> = memo(({ selectedNetwork, setSelectedNetwork }) => {
  const layoutType = useWithdrawLayoutType()
  const dispatch = useDispatch()
  const selectedToken = useSelectedToken()
  const currenciesAllChains = useSpotCurrencies()
  const currenciesOneChains = useSpotCurrencies(
    selectedNetwork?.layerTwoChainId
  )

  const [withdrawTokenList, setWithdrawTokenList] = useState<Currency[]>([])

  useEffect(() => {
    if (layoutType === WithdrawLayoutType.Transfer) {
      setWithdrawTokenList(currenciesAllChains)
    } else {
      setWithdrawTokenList(currenciesOneChains)
    }
  }, [
    selectedNetwork?.layerTwoChainId,
    currenciesOneChains,
    currenciesAllChains,
  ])

  const handleFinedNetWorkToken = (net: ChainInfo) => {
    if (selectedToken?.chains && selectedToken?.chains?.[net.layerTwoChainId]) {
      dispatch(updateSelectedToken({ ...selectedToken }))
    } else {
      dispatch(updateSelectedToken(undefined))
    }
  }
  const handleUpdateSelectToken = (token: Currency) => {
    dispatch(updateSelectedToken(token))
  }
  return (
    <>
      <SelectTokenAndNetworkWrap>
        <SelectToken
          selectedToken={selectedToken!}
          selectedNetwork={selectedNetwork!}
          tokenList={withdrawTokenList}
          onTokenSelected={(token) => {
            handleUpdateSelectToken(token)
          }}
          showSupportFast={layoutType === WithdrawLayoutType.Withdraw}
          showRightBorder={layoutType !== WithdrawLayoutType.Transfer}
        />
        {layoutType !== WithdrawLayoutType.Transfer && (
          <SelectNetwork
            network={selectedNetwork}
            // chains={chains}
            onChangeNetwork={(net) => {
              setSelectedNetwork(net)
              handleFinedNetWorkToken(net)
              dispatch(updateAmount(''))
            }}
          />
        )}
      </SelectTokenAndNetworkWrap>
    </>
  )
})
export default WithdrawTokenAndNetwork
