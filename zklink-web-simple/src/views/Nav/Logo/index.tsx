import { styled } from '@mui/material'
import { ReactComponent as SvgLogo } from 'assets/logo/zklink.svg'
import { memo } from 'react'
import { Link } from 'react-router-dom'

const Wrap = styled(Link)`
  display: flex;
  align-items: center;
  color: #fff;
  flex-shrink: 0;
  gap: 10px;

  h1 {
    font-size: 24px;
    font-weight: 600;
  }
`

export const Logo = memo(() => {
  return (
    <Wrap to="https://zk.link">
      <SvgLogo height="35" />
      <h1>zk.Link</h1>
    </Wrap>
  )
})
