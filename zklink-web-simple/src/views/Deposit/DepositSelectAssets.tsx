import { styled } from '@mui/material'
import { Input } from 'components/InputAmount'

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
export const ActionTitle = styled('div')`
  font-size: 14px;
  line-height: 20px;
  color: #454e68;
`
export const Max = styled('div')`
  line-height: 24px;
  color: ${(props) => props.theme.color.text90};
  padding: 0 12px;
  cursor: pointer;
  background: rgba(3, 212, 152, 0.4);
  border-radius: 2px;
`
export const Available = styled('div')`
  display: flex;
  justify-content: space-between;
  text-align: right;
  font-size: 16px;
  line-height: 16px;
  span {
    color: #76809d;
  }
  b {
    color: #303648;
    font-weight: 500;
  }
`

export const DepositTip = styled('div')`
  font-weight: 500;
  font-size: 12px;
  line-height: 24px;
  color: #5a6689;
  span {
    color: #4c40e6;
  }
`

export const GrayBgContent = styled('div')`
  background: ${(props) => props.theme.color.bgLightGray};
  font-size: 12px;

  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  padding: 12px;
  strong {
  }
`
export const HeaderTip = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: ${(props) => props.theme.color.text70};
`

export const TokenRowInput = styled('div')`
  display: flex;
  align-items: center;
  height: 36px;
  line-height: 16px;
  padding: 0 12px;
  border: 1px solid ${(props) => props.theme.color.text10};
  border-radius: 6px;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 36px;
  }
`

const TokenInput = styled(TokenRowInput)`
  border: none;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.05);
  background: ${(props) => props.theme.color.bg};
`
export const TokenRowInputEle = styled(TokenInput)`
  height: 48px;
  color: ${(props) => props.theme.color.text70};
  font-size: 14px;
  position: relative;
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
export const FeeWrap = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  text-align: center;
  color: ${(props) => props.theme.color.text70};
`
export const SelectTokenAndNetworkWrap = styled(TokenRowInputEle)`
  justify-content: space-between;
  height: 64px;
  padding-left: 0;
  padding-right: 0;
  background: ${(props) => props.theme.color.bg};
`
