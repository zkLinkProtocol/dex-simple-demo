import { Stack, styled } from '@mui/material'
import { FC, memo } from 'react'
import { HistoryTabType } from 'views/History/Tab'

const TabSelector = styled(Stack)`
  flex-flow: wrap;
  flex-direction: row;
  padding: 0 16px;
  width: 100%;
  // border: 1px solid ${(props) => props.theme.color.bgGray};
  ${(props) => props.theme.breakpoints.down('md')} {
    padding-top: 0;
    padding-bottom: 18px;
  }
`
const TabSelectorItem = styled(Stack)`
  align-items: center;
  justify-content: center;
  flex: 1;
  min-width: 33.33%;
  ${(props) => props.theme.breakpoints.down('md')} {
    height: 40px;
    border: 1px solid ${(props) => props.theme.color.text10};
    color: ${(props) => props.theme.color.text40};
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    &:first-of-type {
      border: 1px solid ${(props) => props.theme.color.text10};
    }
    &.active {
      color: ${(props) => props.theme.color.primary40};
      background-color: ${(props) => props.theme.color.primary10};
      border: 1px solid ${(props) => props.theme.color.primary30};
    }
  }
`
export const MobileTab: FC<{
  tabList: string[]
  tabIndex: number
  setTabIndex: (num: number, name?: string) => void
}> = memo(({ tabList, tabIndex, setTabIndex }) => {
  return (
    <TabSelector>
      {tabList.map((item, index) => {
        return (
          <TabSelectorItem
            sx={
              index === HistoryTabType.DashBoard
                ? {
                    display: 'none',
                  }
                : undefined
            }
            className={tabIndex === index ? 'active' : ''}
            onClick={() => setTabIndex(index, item)}
            key={index}>
            {item}
          </TabSelectorItem>
        )
      })}
    </TabSelector>
  )
})
