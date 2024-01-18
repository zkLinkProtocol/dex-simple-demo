import { styled } from '@mui/material'
import { DropContentStyle, FlexBetween, FlexCenter, FlexStart } from 'styles'
import { SelectTokenAndNetworkWrap } from 'views/Deposit/DepositSelectAssets'

export const SelectTokenWrap = styled(SelectTokenAndNetworkWrap)`
  position: relative;
  height: 64px;
  flex: unset;
  padding-left: 12px;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: 100%;
    border-right: unset;
  }
`

export const SelectTokenTitle = styled('div')`
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: #9199b1;
`

export const SelectTokenSelector = styled(FlexBetween)`
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  width: 100%;
  color: ${(props) => props.theme.color?.text90};
  svg {
    margin-right: 17px;
  }
  .img-wrap {
    overflow: hidden;
    background: ${(props) => props.theme.color?.text10};
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin-right: 4px;

    img {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
`
export const SelectTokenSelectorInfo = styled(FlexStart)`
  cursor: pointer;
`
export const SelectNetwork = styled(FlexCenter)`
  height: 20px;
  padding: 0 8px;
  border-radius: 50px;
  background: ${(props) => props.theme.color.bgLightGray};
  margin-left: 12px;
  .img-wrap {
    width: 12px;
    height: 12px;
    border-radius: 2px;
    overflow: hidden;
    img {
      display: block;
    }
  }
  span {
    color: ${(props) => props.theme.color.text60};
    font-size: 12px;
  }
`

export const SelectorInfoRight = styled('div')`
  display: flex;
  margin-right: 12px;
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: #9199b1;
  align-items: flex-end;
  svg {
    margin-right: 0;
  }
`

export const SelectedChain = styled('div')`
  border-left: 1px solid ${(props) => props.theme.color?.text10};
  display: flex;
  flex-direction: column;
  .img-wrap {
    overflow: hidden;
    background: ${(props) => props.theme.color.text10};
    width: 24px;
    height: 24px;
    border-radius: 6px;
    margin-right: 4px;

    img {
      display: flex;
      width: 100%;
      height: 100%;
    }
  }
  .iconfont {
    color: #9199b1;
  }
`

export const SelectedChainName = styled('span')`
  margin-right: 12px;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
export const Popup = styled(DropContentStyle)`
  top: 100%;
  left: 0;
  padding: 16px 0 12px;
  position: absolute;
  border-radius: 12px;
  width: 100%;
  z-index: 10;
  background: ${(props) => props.theme.color?.bg};
  // border: 1px solid #e1e3e7;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12),
    0px 10px 15px -3px rgba(0, 0, 0, 0.12), 0px 4px 6px -2px rgba(0, 0, 0, 0.04);
`

export const LeftColumn = styled('div')`
  width: 120px;
`

export const SearchInput = styled('div')`
  position: relative;
  margin: 0 6px 0 8px;
  input {
    /* width: calc(100% - 16px); */
    width: 100%;
    height: 32px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: ${(props) => props.theme.color?.text30};
    background: unset;
    border-radius: 4px;
    border: 1px solid ${(props) => props.theme.color.text10};
    padding: 0 18px 0 36px;
    &:focus {
      /* border-bottom: 1px solid #e1e3e7; */
      outline: none;
      box-shadow: none;
    }
  }
  svg,
  .iconfont {
    position: absolute;
    left: 10px;
    top: 7px;
  }
`

export const TokenList = styled('div')`
  max-height: 300px;
  overflow: auto;
`

export const CoinItem = styled(FlexStart)`
  margin: 4px 8px 0;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color?.text90};
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  &:hover,
  &.active {
    background: ${(props) => props.theme.color?.bgGray};
  }
  img {
    flex-shrink: 0;
    display: flex;
    width: 24px;
    height: 24px;
    margin-right: 6px;
    border-radius: 50%;
  }
  &.un-support {
    opacity: 0.5;
  }
`

export const RightColumn = styled('div')`
  flex: 1;
  overflow: hidden;
  ${(props) => props.theme.breakpoints.down('md')} {
    width: auto;
    flex: 2;
    overflow: hidden;
  }
`

export const NetItem = styled(CoinItem)`
  margin: 4px 0 0;
  justify-content: space-between;
  img {
    border-radius: 6px;
  }
`
export const NetItemName = styled(FlexStart)`
  &.max-width {
    // max-width: 100px;
    // overflow: hidden;
    span {
    }
  }
  span {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const NetworkList = styled(TokenList)`
  max-height: 332px;
  max-width: 100%;
`

export const Line = styled('div')`
  background: ${(props) => props.theme.color.text10};
  width: 1px;
  margin: 0 8px 0 4px;
`

export const ListTitle = styled('div')`
  color: ${(props) => props.theme.color.text50};
  font-size: 12px;
  line-height: 24px;
  margin-bottom: 4px;
`

export const Limit = styled('span')`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 16px;
  text-align: right;
  font-size: 12px;
  color: ${(props) => props.theme.color.text50};
  &.disabled {
    pointer-events: none;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
