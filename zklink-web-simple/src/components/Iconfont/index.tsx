import { styled } from '@mui/material'
import React, { HTMLAttributes, memo } from 'react'

const IconWrap = styled('div')``

interface IconfontData extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: number
  color?: string
}

const Iconfont: React.FC<IconfontData> = memo(
  ({ name, size = 20, color, className = '' }) => {
    return (
      <IconWrap
        className={`iconfont ${name} ${className}`}
        style={{
          fontSize: `${size}px`,
          lineHeight: `${size}px`,
          color,
        }}></IconWrap>
    )
  }
)

export default Iconfont
