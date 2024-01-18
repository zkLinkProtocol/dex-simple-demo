import { GlobalStyles, ThemeProvider } from '@mui/material'
import { LinkWalletModal } from 'components/LinkWalletModal'
import { OpenMyAccountModal } from 'components/OpenMyAccountModal'
import { PageNotFound } from 'components/PageNotFound'
import StyledContainer from 'components/StyledToastContainer'
import { WaitingForConfirmationModal } from 'components/WaitingForConfirmationModal'
import { WalletModal } from 'components/WalletModal'
import Web3Provider from 'components/Web3Provider'

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useCurrentTheme } from 'store/settings/hooks'
import { StateUpdater } from 'store/updater'
import { getMuiGlobalStyleOption } from 'styles/MuiGlobalStyle'

import { Balances } from './Balances'
import { Deposit } from './Deposit'
import { DepositMobile } from './Deposit/DepositMobile'
import { MainView } from './Main'
import { AccountModal } from './Nav/AccountModal'
import { Transfer } from './Transfer'
import Withdraw from './Withdraw'

export default function App() {
  const MuiTheme = useCurrentTheme()

  return (
    <Web3Provider>
      <StateUpdater />
      <ThemeProvider theme={MuiTheme}>
        <BrowserRouter>
          <GlobalStyles
            styles={(theme) => {
              return getMuiGlobalStyleOption(theme)
            }}
          />
          <Routes>
            <Route path="/" element={<MainView />}>
              <Route path="" element={<Balances />} />
              <Route path="deposit" element={<Deposit />} />
              <Route path="transfer" element={<Transfer />} />
              <Route path="withdraw" element={<Withdraw />} />
              <Route path="deposit/:address" element={<DepositMobile />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>

          <AccountModal />
          <LinkWalletModal />
          <WalletModal />
          <OpenMyAccountModal />
          <WaitingForConfirmationModal />
          <StyledContainer />
        </BrowserRouter>
      </ThemeProvider>
    </Web3Provider>
  )
}
