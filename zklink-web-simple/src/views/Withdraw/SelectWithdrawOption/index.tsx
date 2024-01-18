import { styled } from '@mui/material'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateLayerNum, updateTitleName } from 'store/withdraw/actions'
import { WithdrawLayoutType } from 'store/withdraw/types'
import IconHelp from '../../../components/IconHelp'
import Iconfont from '../../../components/Iconfont'
import i18n from '../../../i18n'
import { ContentWrap, Flex, Space16 } from '../../../styles'

const SelectTokenType = styled(ContentWrap)`
  // display: none;
`
export const DepositTip = styled('div')`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  display: flex;
  align-items: center;

  color: ${(props) => props.theme.color.text60};
  span {
    color: #4c40e6;
  }
  .iconfont {
    margin-right: 4px;
  }
`
export const CoinBtnWrap = styled('div')`
  width: 100%;
  // height: 48px;
  padding: 12px;
  display: flex;
  // align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  flex-direction: column;
  color: ${(props) => props.theme.color.text90};
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  background: ${(props) => props.theme.color.bgLightGray};
  cursor: pointer;

  &:hover {
    > div {
      color: ${(props) => props.theme.color.text00};
    }
    background: ${(props) => props.theme.color.text60};
    > .iconfont {
      color: ${(props) => props.theme.color.text00};
    }
  }
  .iconfont {
    margin-right: 6px;
    // margin-left: 14px;
    display: flex;
    color: ${(props) => props.theme.color.primary30};
  }
`
export const CoinBtnWrapTop = styled(Flex)`
  line-height: 20px;
`
export const CoinBtnWrapBottom = styled(Flex)`
  color: ${(props) => props.theme.color.text60};
  font-weight: 400;
  font-size: 12px;
  line-height: 1.4;
  margin: 8px 0 0 26px;
`

export const SelectWithdrawOption: FC<{
  isWithdraw?: boolean
}> = memo(({ isWithdraw }) => {
  const dispatch = useDispatch()

  return (
    <>
      <DepositTip>
        <IconHelp />
        {isWithdraw ? i18n.t('withdraw-options') : i18n.t('deposit-options')}
      </DepositTip>
      <Space16 />
      <CoinBtnWrap
        onClick={() => {
          dispatch(updateLayerNum(WithdrawLayoutType.Withdraw))

          dispatch(updateTitleName(i18n.t('withdraw-to-layer1-title')))
        }}>
        <CoinBtnWrapTop>
          <Iconfont name="icon-Stablecoin" size={20} />
          {i18n.t('withdraw-to-layer1-title')}
        </CoinBtnWrapTop>
        <CoinBtnWrapBottom>
          {i18n.t('withdraw-to-layer1-describe')}
        </CoinBtnWrapBottom>
      </CoinBtnWrap>
      <Space16 />
      <CoinBtnWrap
        onClick={() => {
          dispatch(updateLayerNum(WithdrawLayoutType.Transfer))
          dispatch(updateTitleName(i18n.t('withdraw-to-layer2-title')))
        }}>
        <CoinBtnWrapTop>
          <Iconfont name="icon-cryptocurrencies" size={20} />
          {i18n.t('withdraw-to-layer2-title')}
        </CoinBtnWrapTop>
        <CoinBtnWrapBottom>
          {i18n.t('withdraw-to-layer2-describe')}
        </CoinBtnWrapBottom>
      </CoinBtnWrap>
    </>
  )
})
