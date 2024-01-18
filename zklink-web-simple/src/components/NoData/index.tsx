import { styled } from '@mui/material'
import { FC, FunctionComponent, memo } from 'react'
import Iconfont from '../Iconfont'

const NoDataWrap = styled('div')`
  display: flex;
  flex-direction: column;
  // width: 100%;
  height: 100%;
  min-height: 200px;
  align-items: center;
  justify-content: center;
  p {
    display: flex;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    margin: 0 0 0 -20px;
    color: ${(props) => props.theme.color.text60};
  }
  svg path {
    fill: ${(props) => props.theme.color.primary30};
  }
`
const Wrap = styled('div')``
export const NoData: FC<{
  size?: number
  width?: string
  height?: string
  text?: string
  className?: string
  icon?: string
  SVG?: FunctionComponent
}> = memo(
  ({
    icon = 'icon-a-nodata',
    text = 'No data',
    size = 63,
    width = '100%',
    height = '100%',
    className = '',
    SVG,
  }) => {
    const SvgWrap = SVG || Wrap
    return (
      <NoDataWrap style={{ width, height }} className={className}>
        <Iconfont
          name={icon}
          size={size}
          color="rgba(142, 205, 30, 1)"></Iconfont>
        <SvgWrap />
        <p>{text}</p>
      </NoDataWrap>
    )
  }
)
