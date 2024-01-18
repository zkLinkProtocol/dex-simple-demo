import { Stack } from '@mui/material'
import { styled } from '@mui/material/styles'
import {
  ContentWrap,
  Flex,
  FlexBetween,
  FlexCenter,
  FlexColumn,
  specifyTheme,
} from 'styles/index'
import { darkColor } from '../../styles/constants/dark'
import { lightColor } from '../../styles/constants/light'

export const HistoryWrap = styled(ContentWrap)`
  width: 100%;
  height: calc(100vh - 32px - 42px);
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.color?.bg};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0;
    height: calc(100vh - 64px);
  }
`
export const HistoryTable = styled(Flex)`
  flex-direction: column;
  flex: 1;
  flex-shrink: 0;
  height: 0;
  overflow-y: auto;
  border: 1px solid ${(props) => props.theme.color?.text10};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  ${(props) => props.theme.breakpoints.down('md')} {
    border: unset;
    box-shadow: unset;
    padding-bottom: 50px;
    height: unset;
    flex: 1;
    flex-shrink: unset;
    overflow: auto;
  }
`
export const TableRow = styled('div')`
  display: flex;
  height: 52px;
  align-items: center;
`
export const TableHead = styled(TableRow)`
  height: 40px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  border-radius: 8px 8px 0 0;
  color: ${(props) => props.theme.color?.text60};
  background: ${(props) => props.theme.color?.bgGray};
  border-bottom: 1px solid ${(props) => props.theme.color?.text10};
  div {
    padding-left: 12px;
  }
  .data {
    padding-left: 24px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
export const TableCell = styled(Flex)`
  padding: 16px 12px;
  line-height: 20px;
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => props.theme.color?.text60};
`
export const TableContent = styled('div')`
  flex: 1;
  flex-shrink: 0;
  height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  > :nth-of-type(even) {
    background: ${(props) => props.theme.color?.bgLightGray};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
export const MobileTableContent = styled(FlexColumn)`
  height: 100vh;
  // background: red;
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
    height: unset;
  }
`
export const MobileTableItem = styled(FlexBetween)`
  padding: 18px 16px;
  border-bottom: 1px solid ${(props) => props.theme.color?.bgGray};
`
export const MobileTableItemLeft = styled(FlexCenter)`
  img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }
`
export const MobileTableItemLeftInfo = styled(FlexColumn)``
export const MobileTableCoinName = styled(FlexCenter)`
  margin-bottom: 4px;
  color: ${(props) => props.theme.color?.text90};
  div {
    display: flex;
    background: ${(props) => props.theme.color?.bgGray};
    border-radius: 10px;
    font-weight: 500;
    font-size: 12px;
    line-height: 16px;
    margin-left: 4px;
    padding: 2px 10px;
    color: ${(props) => props.theme.color?.text90};
    max-width: 99px;

    span {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`
export const MobileTableCoinTime = styled(Flex)`
  font-weight: 400;
  font-size: 12px;
  line-height: 20px;
  color: ${(props) => props.theme.color?.text60};
`

export const MobileTableItemRight = styled(FlexColumn)`
  align-items: flex-end;
`
export const MobileTableItemAmount = styled(Flex)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: ${(props) => props.theme.color?.text60};
  span {
    color: ${(props) => props.theme.color?.text90};
    margin-left: 8px;
  }
`
export const MobileTableItemTxid = styled(FlexCenter)`
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${(props) => props.theme.color?.text60};
  span {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: ${(props) => props.theme.color?.textHighlight};
    margin-left: 8px;
  }
`
export const MobileTableItemStatus = styled(FlexColumn)``

export const TableDate = styled(TableCell)`
  font-weight: 500;
  width: 14%;
  padding-left: 24px;
`
export const TableDateContent = styled(TableDate)`
  color: ${(props) => props.theme.color?.text90};
  font-weight: 500;
`
export const TableId = styled(TableCell)`
  width: 12%;
`
export const TableAmount = styled(TableCell)`
  flex: 1;
`
export const TableAsset = styled(TableCell)`
  width: 6%;
  display: flex;
  img {
    width: 20px;
  }
`
export const TableAssetContent = styled(TableAsset)``
export const TableAdd = styled(TableCell)`
  width: 28%;
  display: flex;
`
export const TableAddContent = styled(TableAdd)``
export const TableTransferAdd = styled(TableAdd)`
  width: 14%;
  display: flex;
`
export const TableTransferAddContent = styled(TableTransferAdd)``
export const TableTxid = styled(TableCell)`
  width: 10%;
`
export const TableTxidContent = styled(TableTxid)`
  color: ${(props) => props.theme.color?.textHighlight};
  cursor: pointer;
`
export const TableStatus = styled(TableCell)`
  width: 10%;
`
export const StatusItem = styled(FlexCenter)`
  padding-left: 4px;
  border-radius: 10px;

  &.Fail {
    color: ${(props) => props.theme.color?.notificationRed02};
  }
  &.Success {
    color: ${(props) => props.theme.color?.notificationGreen02};
  }
  &.Pending,
  &.Processing {
    color: ${(props) => props.theme.color?.notificationYellow02};
  }
  &.Confirming {
    color: ${(props) => props.theme.color?.notificationBlue02};
  }
`
export const PaginationWrap = styled('div')`
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 20px;
  color: ${(props) => props.theme.color?.text60};
  background: ${(props) => props.theme.color?.bg};
  ${(props) => props.theme.breakpoints.down('md')} {
    position: absolute;
    left: 0;
    bottom: 55px;
    width: 100%;
    height: 50px;
    padding: 10px;
  }
`
export const TotalRes = styled('div')`
  font-weight: 400;
  ${(props) => props.theme.breakpoints.down('md')} {
    font-size: 12px;
  }
`
export const HistoryTitle = styled(Stack)`
  padding: 12px 0;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
export const MobileHistoryTitle = styled(Stack)`
  padding: 20px 0 0;
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
    width: 100%;
  }
`
export const TitleItem = styled(Flex)`
  justify-content: center;
  align-items: center;
  padding: 8px 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  color: ${(props) => props.theme.color?.text50};
  &.active {
    color: ${(props) =>
      specifyTheme(props, darkColor.primary40, lightColor.text90)};
    background: ${(props) => props.theme.color?.bgHistoryTabs};
  }
  &:hover {
    cursor: pointer;
    color: ${darkColor.text00};
    background: ${(props) => props.theme.color?.TabHoverColor};
  }
`
