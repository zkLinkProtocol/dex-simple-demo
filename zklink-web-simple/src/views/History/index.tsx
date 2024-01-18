import { styled } from '@mui/material'
import { ReactComponent as SvgHistoryActive } from 'assets/nav/history-active.svg'
import { ConnectWalletGuide } from 'components/ConnectWalletGuide'
import i18n from 'i18n'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { useIsActivated } from 'store/account/hooks'
import { Flex } from 'styles'
import { MainWrap } from 'views/Main/styles'
import { DepositHistoryPage } from './DepositHistory'
import { HistoryTabType } from './Tab'
import { TransferHistoryPage } from './TransferHistory'
import { WithdrawHistoryPage } from './WithdrawHistory'
import { HistoryWrap } from './style'

const Title = styled(Flex)`
  width: 100%;
  // height: 64px;
  padding: 10px 16px 0;
  h1 {
    font-weight: 600;
    font-size: 18px;
    line-height: 24px;
    color: ${(props) => props.theme.color.text100};
    padding: 0;
    margin: 0;
  }
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
  }
`
const SvgWrap = styled('div')`
  margin-right: 12px;
  width: 16px;
  display: none;
  ${(props) => props.theme.breakpoints.down('md')} {
    display: flex;
  }
`
export const HistoryView = memo(() => {
  const isActivated = useIsActivated()

  const { type: tabType } = useParams<{ type: string }>()

  const currentHistoryTab = +(
    HistoryTabType[tabType as unknown as HistoryTabType] ??
    HistoryTabType.DashBoard
  )

  return (
    <MainWrap>
      <HistoryWrap>
        {!isActivated ? (
          <ConnectWalletGuide
            fontSize={20}
            title={i18n.t('history-connect-wallet')}
          />
        ) : (
          <>
            <Title>
              <SvgWrap>
                <SvgHistoryActive />
              </SvgWrap>
              <h1>{i18n.t('nav-balance-history')}</h1>
            </Title>
            {currentHistoryTab === HistoryTabType.Deposit && (
              <DepositHistoryPage />
            )}
            {currentHistoryTab === HistoryTabType.Withdraw && (
              <WithdrawHistoryPage />
            )}
            {currentHistoryTab === HistoryTabType.Transfer && (
              <TransferHistoryPage />
            )}
          </>
        )}
      </HistoryWrap>
    </MainWrap>
  )
})
