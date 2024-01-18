import { Stack, styled } from '@mui/material'
import { memo } from 'react'
import { NavLink } from 'react-router-dom'

const MenuWrap = styled(Stack)`
  flex-direction: row;
  align-items: center;
  padding: 0 0 0 48px;
  gap: 8px;

  ${(props) => props.theme.breakpoints.down('md')} {
    justify-content: space-around;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    padding: 0 8px;
    border-top: 1px solid ${(props) => props.theme.color.bgGray};
    background: ${(props) => props.theme.color.bg};
  }

  a {
    font-size: 16px;
    line-height: 24px;
    color: ${(props) => props.theme.color.text50};
    padding: 0 10px;
  }
  a.active {
    color: ${(props) => props.theme.palette.primary.main};
  }

  ${(props) => props.theme.breakpoints.down('md')} {
    a {
      font-size: 14px;
    }
  }
`

function menuClassName({ isActive, isPending }: any) {
  return isPending ? 'pending' : isActive ? 'active' : ''
}

export const Menu = memo(() => {
  return (
    <MenuWrap>
      <NavLink to={'/'} className={menuClassName}>
        Assets
      </NavLink>
      <NavLink to={'/deposit'} className={menuClassName}>
        Deposit
      </NavLink>
      <NavLink to={'/transfer'} className={menuClassName}>
        Transfer
      </NavLink>
      <NavLink to={'/withdraw'} className={menuClassName}>
        Withdraw
      </NavLink>
    </MenuWrap>
  )
})
