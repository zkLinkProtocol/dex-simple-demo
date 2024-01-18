import { Stack, styled } from '@mui/material'
import { ReactComponent as SvgBalanceActive } from 'assets/nav/balance-active.svg'
import { ConnectWalletGuide } from 'components/ConnectWalletGuide'
import Iconfont from 'components/Iconfont'
import i18n from 'i18n'
import { memo } from 'react'
import { useAppDispatch } from 'store'
import { useLinkConnected } from 'store/link/hooks'
import { updateShowBalanceInfo } from 'store/settings/actions'
import { useShowBalanceInfo } from 'store/settings/hooks'
import { ContentWrap, SectionWrap } from 'styles'
import { transientOptions } from 'styles/TransientOptions'
import { MainWrap } from 'views/Main/styles'
import { BalanceButtonGroup } from './BalanceButtonGroup'
import { BalanceTokenList } from './BalanceTokenList'
import { BalanceTotalInfo } from './BalanceTotalInfo'

export interface BalanceData {
  address?: string
  available: string | number
  freeze: string | number
  iconTokenUrl?: string
  id?: number
  name?: string
  symbol: string | undefined
  value: string
}

export const BalancesWrap = styled(SectionWrap)`
  display: flex;
  flex-direction: column;
  flex: 1;
  background: ${(props) => props.theme.color.bg};
  border-radius: 4px;
  ${(props) => props.theme.breakpoints.up('md')} {
    margin-top: 12px;
    position: relative;
  }
`

export const BalanceTitle = styled('div', transientOptions)<{
  $isLogin: boolean
}>`
  height: 32px;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  border-bottom: 1px solid ${(props) => props.theme.color.text10};
  padding: 8px 12px;
  color: ${(props) => props.theme.color.text70};
  display: flex;
  align-items: center;
  .iconfont {
    cursor: pointer;
  }
  svg {
    width: 18px;
    height: 18px;
  }
  ${(props) => props.theme.breakpoints.down('md')} {
    height: unset;
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    display: ${(props) => (props.$isLogin ? 'flex' : 'none')};
    padding: 10px 20px;
    border: 1px solid ${(props) => props.theme.color.bgGray};
    .iconfont {
      font-size: 20px !important;
      font-weight: 400;
    }
  }
`
export const BalanceTitleSvg = styled('div')(({ theme }) => ({
  display: 'none',
  width: 18,
  height: 18,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
  [theme.breakpoints.down('md')]: {
    display: 'flex',
  },
}))

export const BalanceInfo = styled(Stack)`
  margin-bottom: 4px;
  flex: 1;
  min-height: 400px;
`
export const Introduce = styled(Stack)`
  gap: 8px;
  padding-bottom: 24px;
  h2 {
    font-size: 16px;
    line-height: 24px;
    margin: 0;
  }
  p {
    font-size: 12px;
    line-height: 18px;
    color: #999999;
    margin: 0;
  }
  a {
    color: #03d498;
  }
`

export interface TotalBalanceData {
  [index: string]: TotalBalance
}
export interface TotalBalance {
  currentBalance: string
  openingBalance: string
}
export const Balances = memo(() => {
  const dispatch = useAppDispatch()
  const linkConnected = useLinkConnected()
  const showBalanceInfo = useShowBalanceInfo()

  return (
    <MainWrap>
      <ContentWrap>
        <BalanceButtonGroup />
        <BalancesWrap>
          <BalanceTitle $isLogin={linkConnected}>
            <BalanceTitleSvg>
              <SvgBalanceActive />
            </BalanceTitleSvg>
            <span>{i18n.t('balances-title', { defaultValue: 'Balance' })}</span>
            <span
              style={{ marginLeft: 4 }}
              onClick={() => dispatch(updateShowBalanceInfo(!showBalanceInfo))}>
              {showBalanceInfo ? (
                <Iconfont name="icon-eye-open" size={16} />
              ) : (
                <Iconfont name="icon-eye-slashed" size={16} />
              )}
            </span>
          </BalanceTitle>
          <BalanceInfo>
            {linkConnected ? (
              <>
                <BalanceTotalInfo />
                <BalanceTokenList />
              </>
            ) : (
              <Stack flex={1} justifyContent="center">
                <ConnectWalletGuide responsive={true} />
              </Stack>
            )}
          </BalanceInfo>
        </BalancesWrap>
      </ContentWrap>
    </MainWrap>
  )
})
