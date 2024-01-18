import { styled } from '@mui/material'

export const PCWrap = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}))

export const MobileWrap = styled('div')(({ theme }) => ({
  width: '100%',
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}))

export const OnlyMobile = styled('div')`
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
  }
`

export const OnlyDesktop = styled('div')`
  display: flex;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: none;
  }
`
