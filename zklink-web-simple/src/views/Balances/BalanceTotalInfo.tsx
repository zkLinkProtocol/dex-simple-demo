import { styled } from '@mui/material'
import { FC, ReactNode, memo } from 'react'
import { useTotalAvailableValue } from 'store/app/hooks'
import { useShowBalanceInfo } from 'store/settings/hooks'
import { parseWeiToEther, toFixed, toGrouping } from 'utils/number'

const BalanceInfoWrap = styled('div')`
  border-bottom: 4px solid ${(props) => props.theme.color.bgGray};
`
const BalanceInfoPrice = styled('div')`
  font-weight: 600;
  font-size: 24px;
  line-height: 24px;
  // height: 50px;
  text-align: center;
  padding: 16px 10px;
  color: ${(props) => props.theme.color.text90};
  display: flex;
  align-items: center;
  justify-content: center;
  .iconfont {
    cursor: pointer;
  }
  span {
    display: inline-block;
    vertical-align: middle;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    padding: 0;
    font-weight: 600;
    font-size: 32px;
    line-height: 32px;
  }
`
const BalanceInfoData = styled('div')`
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  // color: #419e6a;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 9px auto 14px;
  .bg {
    background: #e8fcf1;
    border-radius: 2px;
    padding: 1px 3px;
    margin-left: 8px;
  }
  .text-gray {
    color: ${(props) => props.theme.color.text40};
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
  }
`

export const BalanceTotalInfo: FC<{ actions?: ReactNode }> = memo(
  ({ actions }) => {
    const totalAvailableUSDValue = useTotalAvailableValue()

    const showBalanceInfo = useShowBalanceInfo()

    return (
      <BalanceInfoWrap>
        <BalanceInfoPrice>
          <span>
            {showBalanceInfo
              ? '$' +
                toFixed(
                  toGrouping(parseWeiToEther(totalAvailableUSDValue)),
                  2,
                  { fixed: true }
                )
              : '******'}
          </span>
        </BalanceInfoPrice>
        {actions}
      </BalanceInfoWrap>
    )
  }
)
