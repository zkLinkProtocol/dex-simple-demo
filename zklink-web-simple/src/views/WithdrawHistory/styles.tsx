import { Stack, styled } from '@mui/material'
import { Flex, FlexBetween, FlexItem } from 'styles'

export const ListWrap = styled(Flex)`
  gap: 20px;
  flex-wrap: wrap;
  padding-bottom: 40px;
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 20px 0px 60px;
    margin: 0 16px;
  }
`

export const ItemWrap = styled(FlexBetween)`
  border-radius: 8px;
  padding: 0 16px;
  height: 60px;
  border-bottom: 1px solid ${(props) => props.theme.color.bgLightGray};
  &:first-of-type {
    margin-top: 0;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0 8px;
    * {
      font-size: 12px !important;
      white-space: nowrap !important;
    }
  }
  .item-left {
    ${(props) => props.theme.breakpoints.down('md')} {
      margin-left: 0;
    }
  }
`
export const PlaceholderItem = styled(FlexItem)`
  ${(props) => props.theme.breakpoints.down('md')} {
    min-width: 80%;
  }
`
export const AddressText = styled(Stack)`
  color: ${(props) => props.theme.color.textHighlight};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  line-height: 20px;
`

export const TokenText = styled(Stack)`
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.color.text90};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`

export const TimeText = styled('div')`
  color: ${(props) => props.theme.color.text50};
  font-size: 12px;
  font-weight: 500;
  margin-top: 4px;
  line-height: 20px;
`

export const ValueText = styled('span')`
  color: ${(props) => props.theme.color.text50};
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
`

export const RightColumn = styled('div')`
  width: 148px;
  flex-direction: column;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 8px;
`
