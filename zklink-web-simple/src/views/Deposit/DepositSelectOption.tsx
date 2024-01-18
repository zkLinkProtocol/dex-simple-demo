import { styled } from '@mui/material/styles'
import Iconfont from 'components/Iconfont'
import IconHelp from 'components/IconHelp'
import i18n from 'i18n'
import { FC, memo } from 'react'
import { useDispatch } from 'react-redux'
import { updateDepositModalOption } from 'store/deposit/actions'
import { DepositModalOption } from 'store/deposit/types'
import { ContentWrap, Flex, Space16 } from 'styles'

const SelectTokenType = styled(ContentWrap)``
export const DepositTip = styled('div')`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  display: flex;
  align-items: start;

  color: ${(props) => props.theme.color.text60};
  span {
    color: #4c40e6;
  }
  .iconfont {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    color: ${(props) => props.theme.color.bg};
    background: ${(props) => props.theme.color.primary30};
    margin-right: 4px;
    margin-top: 3px;
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
export const CoinBtnWrapTop = styled(Flex)``
export const CoinBtnWrapBottom = styled(Flex)`
  color: ${(props) => props.theme.color.text60};
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  margin-left: 28px;
`

export const DepositSelectOption = memo(() => {
  const dispatch = useDispatch()
  return (
    <SelectTokenType>
      <DepositTip>
        <IconHelp />
        {i18n.t('deposit-options')}
      </DepositTip>
      <Space16 />
      <DepositSelectOptionItems
        onSelectOption={(option) => {
          dispatch(updateDepositModalOption(option))
        }}
      />
    </SelectTokenType>
  )
})

export const DepositSelectOptionItems: FC<{
  onSelectOption: (option: DepositModalOption) => void
}> = memo(({ onSelectOption }) => {
  return (
    <>
      <CoinBtnWrap
        onClick={() => {
          onSelectOption(DepositModalOption.SelectAssets)
        }}>
        <CoinBtnWrapTop>
          <Iconfont name="icon-wallet" size={20} />
          {i18n.t('deposit-option-1-tile', {
            defaultValue: 'Transfer crypto from personal wallet',
          })}
        </CoinBtnWrapTop>
        <CoinBtnWrapBottom>
          {i18n.t('deposit-option-1-describe')}
        </CoinBtnWrapBottom>
      </CoinBtnWrap>

      {/*
      <Space16 />
       <CoinBtnWrap
        onClick={() => {
          onSelectOption(DepositModalOption.Qrcode)
        }}>
        <CoinBtnWrapTop>
          <Iconfont name="icon-qr-code" size={20} />
          {i18n.t('deposit-option-2-tile', {
            defaultValue: 'Transfer crypto from mobile wallet',
          })}
        </CoinBtnWrapTop>
        <CoinBtnWrapBottom>
          {i18n.t('deposit-option-2-describe', {
            defaultValue:
              'Scan a unique QR Code to deposit funds to your Nexus account.',
          })}
        </CoinBtnWrapBottom>
      </CoinBtnWrap> */}
    </>
  )
})
