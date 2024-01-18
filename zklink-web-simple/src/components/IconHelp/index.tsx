import { styled } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'
import Iconfont from 'components/Iconfont'
import { breakpoints } from 'config/theme'
import useResize from 'hooks/useResize'
import React, { memo, useEffect, useState } from 'react'

const { md } = breakpoints.values!

interface IconfontData {
  content?: string
  size?: number
}

const IconWrap = styled('div')<{
  size?: number
}>`
  .iconfont {
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${(props) => `${props.size || 18}px`};
    height: ${(props) => `${props.size || 18}px`};
    margin-left: 4px;
    color: ${(props) => props.theme.color.bg};
    background: ${(props) => props.theme.color.primary30};
    border: 1px solid ${(props) => props.theme.color?.primary30};
    border-radius: 50%;
    &:hover {
      color: ${(props) => props.theme.color?.bg};
      background: ${(props) => props.theme.color?.primary30};
    }
  }
  &.has-hover {
    cursor: pointer;
    .iconfont {
      color: ${(props) => props.theme.color?.primary30};
      background: unset;
      &:hover {
        color: ${(props) => props.theme.color?.bg};
        background: ${(props) => props.theme.color?.primary30};
      }
    }
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
  }
`
const IconHelp: React.FC<IconfontData> = memo(({ content, size = 18 }) => {
  const [openTooltip, setOpenTooltip] = useState<boolean>(false)
  const { innerWidth } = useResize()
  useEffect(() => {
    setOpenTooltip(false)
  }, [innerWidth])

  const PcElem = (content: string) => {
    return (
      <Tooltip title={content} arrow placement="bottom">
        <IconWrap className={'has-hover'} size={size}>
          <Iconfont name="icon-infoDefault_new" size={size} />
        </IconWrap>
      </Tooltip>
    )
  }
  const MobileElem = (content: string) => {
    return (
      <Tooltip title={content} arrow placement="bottom" open={openTooltip}>
        <IconWrap
          className={'has-hover'}
          size={size}
          onClick={() => {
            setOpenTooltip(!openTooltip)
          }}>
          <Iconfont name="icon-infoDefault_new" size={size} />
        </IconWrap>
      </Tooltip>
    )
  }
  return (
    <>
      {content ? (
        <>
          {innerWidth <= md && MobileElem(content)}
          {innerWidth > md && PcElem(content)}
        </>
      ) : (
        <IconWrap size={size}>
          <Iconfont name="icon-infoDefault_new" size={size} />
        </IconWrap>
      )}
    </>
  )
})

export default IconHelp
