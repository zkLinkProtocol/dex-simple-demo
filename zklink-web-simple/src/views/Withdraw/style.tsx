import { styled, Tooltip, tooltipClasses } from '@mui/material'
import { ContentWrap, Flex, FlexCenter, specifyTheme } from 'styles'
import { darkColor } from '../../styles/constants/dark'
import { lightColor } from '../../styles/constants/light'
import { HeaderTip } from '../Deposit/DepositSelectAssets'

export const HeaderTipValue = styled(HeaderTip)`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
`
export const ContentSwapFlex = styled(ContentWrap)`
  padding: 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: block;
  }
`
export const WithdrawSelectWrap = styled('div')`
  ${(props) => props.theme.breakpoints.down('md')} {
    max-height: 70vh;
    overflow: auto;
    padding-bottom: unset;
  }
`
export const SupportButtons = styled('div')`
  display: flex;
  align-items: center;
  margin-top: 4px;
  > div {
    width: 73px;
    height: 32px;
    background: #e3e5eb;
    border-radius: 6px;
    margin-right: 12px;
    color: #adb1c3;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  > div {
    background: ${(props) => props.theme.color.bg};
    color: ${(props) => props.theme.color.text40};
    &:hover {
      border: 1px solid ${(props) => props.theme.color.text30};
    }
    &.active {
      background: ${(props) => props.theme.palette.primary.main};
      color: ${darkColor.text00};
      &:hover {
        border: 1px solid ${(props) => props.theme.palette.primary.main};
      }
    }
  }
  svg {
    margin-right: 4px;
  }
  .disable {
    .iconfont {
      color: ${(props) => props.theme.color.text20};
      border: 1px solid ${(props) => props.theme.color.text20};
    }
  }
  .iconfont {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${(props) =>
      specifyTheme(props, darkColor.text00, lightColor.primary40)};
    background: unset;
    border: 1px solid
      ${(props) => specifyTheme(props, darkColor.text00, lightColor.primary40)};
    border-radius: 50%;
    margin-right: 4px;
  }
`

export const FromTip = styled('div')`
  color: ${(props) => props.theme.color.text70};
`
export const BootstrapTooltip = styled(Tooltip)(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.black,
  },
}))
export const AddressBookIconWrap = styled(FlexCenter)`
  margin-left: 12px;
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  border-radius: 50%;
  .iconfont {
    color: ${(props) => props.theme.color.text00};
  }
`
export const AddressDetectedWrap = styled(Flex)`
  padding: 8px 16px;
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  background-color: ${(props) => props.theme.color.primary10};
  color: ${(props) => props.theme.color.text80};
  border-radius: 6px;
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  cursor: pointer;
  white-space: pre;
  span {
    font-weight: 600;
    color: ${(props) => props.theme.color.primary40};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 12px;
    justify-content: center;
  }
`
export const Popup = styled('div')`
  z-index: 10;
  position: absolute;
  border-radius: 4px;
  min-width: calc(100% - 72px);
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12),
    0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.04);
  background: ${(props) => props.theme.color.bg};
`
export const AddressBookList = styled(Flex)`
  flex-direction: column;
  /* padding: 4px 8px; */
  /* gap: 4px; */
  max-height: 210px;
  overflow-y: auto;
`
export const AddressBookListItem = styled(Flex)`
  padding: 6px 12px;
  align-items: center;
  cursor: pointer;
  .action {
    display: none;
  }
  &:hover {
    background-color: ${(props) => props.theme.color.bgGray};
    border-radius: 4px;
    .action {
      display: flex;
    }
  }
`
export const WalletName = styled('div')`
  flex: 1;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text90};
  &.collection {
    font-weight: 600;
  }
`
export const WalletActionWrap = styled(Flex)`
  align-items: center;
  gap: 18px;
`
export const WalletAction = styled(Flex)`
  align-items: center;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.textHighlight};
`
export const WalletAddress = styled(Flex)`
  justify-content: flex-end;
  margin-left: 48px;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color.text60};
`
export const CurrentUseAddressWrap = styled(Flex)`
  flex: 1;
  align-items: center;
  color: ${(props) => props.theme.color.text90};
  font-size: 16px;
  line-height: 24px;
  white-space: pre;
`
export const CurrentUseWalletName = styled('div')`
  font-weight: 600;
  strong {
    font-weight: 700;
  }
`
export const CurrentUseAddress = styled('div')`
  font-weight: 400;
`
export const CurrentAddress = styled(Flex)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  color: ${(props) => props.theme.color.text90};
  font-size: 16px;
  line-height: 24px;
  align-items: center;
  background: ${(props) => props.theme.color.bg};
  padding: 0 12px;
  border-radius: 6px;
  cursor: text;
  strong {
    font-weight: 700;
  }
  white-space: pre;
`
