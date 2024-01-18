import { ChainInfo } from 'api/v3/chains'
import Iconfont from 'components/Iconfont'
import { FC, memo, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { updateSelectFast } from 'store/withdraw/actions'
import { useSelectFast, useSelectedToken } from 'store/withdraw/hook'
import { Space16, Space4 } from 'styles'
import { GrayBgContent } from '../Deposit/DepositSelectAssets'
import { BootstrapTooltip, FromTip, SupportButtons } from './style'

const WithdrawSpeed: FC<{
  selectedNetwork: ChainInfo | undefined
}> = memo(({ selectedNetwork }) => {
  const selectedToken = useSelectedToken()
  const selectFast = useSelectFast()
  const dispatch = useDispatch()

  const selectedTokenChain = useMemo(() => {
    if (selectedNetwork?.layerTwoChainId) {
      return selectedToken?.chains?.[selectedNetwork.layerTwoChainId]
    }
    return undefined
  }, [selectedToken, selectedNetwork])

  useEffect(() => {
    dispatch(updateSelectFast(!!selectedTokenChain?.fastWithdraw))
  }, [selectedToken])
  return (
    <>
      <GrayBgContent>
        <FromTip>
          Maximum withdrawal time:{' '}
          {selectFast ? <b>60 minutes</b> : <b>24 hours</b>}, average withdrawal
          time: {selectFast ? <b>5 minutes</b> : <b>6 hours</b>}
        </FromTip>
        <Space4 />
        <SupportButtons>
          <BootstrapTooltip
            title={
              selectedTokenChain?.fastWithdraw
                ? 'Faster withdrawal via broker at higher cost'
                : 'Withdrawal via broker not available for this token'
            }
            placement="bottom-start"
            className="arrow">
            <div
              onClick={() => {
                if (selectedTokenChain?.fastWithdraw) {
                  dispatch(updateSelectFast(true))
                }
              }}
              className={`fast ${selectFast ? 'active' : 'disable'} ${
                !selectedTokenChain?.fastWithdraw ? 'disable' : ''
              }`}>
              {/* {selectFast ? <SVGFast /> : <SVGFastDisable />} */}
              <Iconfont name="icon-flashlight-fill" size={16}></Iconfont>
              Fast
            </div>
          </BootstrapTooltip>
          <BootstrapTooltip
            title="Decentralized withdrawal at lower cost"
            placement="bottom-start">
            <div
              onClick={() => dispatch(updateSelectFast(false))}
              className={`slow ${!selectFast ? 'active' : ''}`}>
              Standard
            </div>
          </BootstrapTooltip>
        </SupportButtons>
      </GrayBgContent>
      <Space16 />
    </>
  )
})
export default WithdrawSpeed
