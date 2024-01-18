import { styled } from '@mui/material'
import { memo } from 'react'
import { FlexItem } from 'styles'
import { NetworkSelect } from 'views/Nav/NetworkSelect'
import { ConnectButton } from './ConnectButton'
import { Logo } from './Logo'
import { Menu } from './Menu'

const NavWrap = styled('div')`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 64px;
  gap: 12px;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
  background: ${(props) => props.theme.color.bg};
  z-index: 100;

  ${(props) => props.theme.breakpoints.down('md')} {
    gap: 8px;
    padding: 0 16px;
  }
`

export const Nav = memo(() => {
  return (
    <NavWrap>
      <Logo />
      <Menu />
      <FlexItem />
      <NetworkSelect />
      <ConnectButton />
    </NavWrap>
  )
})
