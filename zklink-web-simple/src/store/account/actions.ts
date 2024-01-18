import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AccountInfo, getAccount } from 'api/v3/account'
import { getAccountBalances } from 'api/v3/balances'
import { SUB_ACCOUNT_ID } from 'config'
import { RootState } from 'store'
import { AccountId, Address, Ether, TokenId } from 'types'
import { AccountTickets, CurrencyBalance } from './reducer'

export const updateAccountInfo = createAction<AccountInfo | null>(
  'account/updateAccountInfo'
)
export const updateAccountActivatingAction = createAction<boolean>(
  'account/updateAccountActivatingAction'
)
export const updateAccountTickets = createAction<AccountTickets | undefined>(
  'account/updateAccountTickets'
)
export const signoutAction = createAction('account/signoutAction')

export const getAccountInfoAction = createAsyncThunk<
  AccountInfo | null,
  {
    address: Address
  }
>('account/getAccountInfoAction', async ({ address }) => {
  const response = await getAccount(address).catch((e) => {
    // If the user is not registered, save the address and signature to Redux.
    // Then use tickets to loop requests and listen for account info.
    // If the user deposits the currency to the account, it will respond with the account info and remove the tickets to stop the loop request.
    console.error(e)
    return null
  })

  if (!response) {
    return null
  }
  return response.result
})

export const getAccountBalanceAction = createAsyncThunk<
  CurrencyBalance[],
  AccountId,
  {
    state: RootState
  }
>('account/getAccountBalanceAction', async (accountId, { getState }) => {
  const state = getState()
  const { tokens } = state.app

  const { result } = await getAccountBalances(accountId)
  const zklinkBalances = result[SUB_ACCOUNT_ID]
  const tokenIds: TokenId[] = Object.keys(result[SUB_ACCOUNT_ID]).map((v) =>
    Number(v)
  )
  const list: CurrencyBalance[] = tokenIds.map((v) => {
    const currency = tokens.find((c) => c.l2CurrencyId === v)
    if (!currency) {
      return {
        currencyId: v,
        currency: '',
        main: false,
        available: '0',
        freeze: '0',
      }
    }
    return {
      currencyId: currency.l2CurrencyId,
      currency: currency.l2Symbol,
      main: currency.main,
      available: zklinkBalances[v],
      freeze: '0',
    }
  })
  return list
})
export const updateBalancesAction = createAction<{
  currencyId: TokenId
  available: Ether
  freeze: Ether
}>('account/updateBalancesAction')

export const updateUserToken = createAction<string>('account/updateUserToken')
