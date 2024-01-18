import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import { AddressBookRow } from 'api/v1/addressBook'
import {
  TransactionHistoryDetail,
  getAccountTransactionHistory,
} from 'api/v3/getAccountTransactionHistory'
import { Currency, getTokenReserve } from 'api/v3/tokens'
import { compact } from 'lodash'
import { RootState } from 'store'
import { Ether, L2ChainId, TokenId, Wei } from 'types'
import { maxBigNumber } from 'utils/number'
import { WithdrawLayoutType, WithdrawStatus } from './types'

export const updateLayerNum = createAction<WithdrawLayoutType>(
  'withdraw/updateLayerNum'
)
export const updateTitleName = createAction<string>('withdraw/updateTitleName')
export const updateShowAddressBookList = createAction<boolean>(
  'withdraw/updateShowAddressBookList'
)
export const updateIsFocus = createAction<boolean>('withdraw/updateIsFocus')
export const updateShowAddAddress = createAction<boolean>(
  'withdraw/updateShowAddAddress'
)
export const updateIsUseAddressBook = createAction<boolean>(
  'withdraw/updateIsUseAddressBook'
)
export const updateAddOrEditAddress = createAction<string>(
  'withdraw/updateAddOrEditAddress'
)
export const updateAmount = createAction<Ether>('withdraw/updateAmount')

export const updateAddressBookList = createAction<AddressBookRow[]>(
  'withdraw/updateAddressBookList'
)
export const updateCurrentEditAddressBook = createAction<AddressBookRow>(
  'withdraw/updateCurrentEditAddressBook'
)
export const updateCurrentUseAddressBook = createAction<AddressBookRow>(
  'withdraw/updateCurrentUseAddressBook'
)

export const updateIsAddOrEditAddressBook = createAction<number | undefined>(
  'withdraw/updateIsAddOrEditAddressBook'
)

export const updateWidthAddress = createAction<string>('withdraw/updateAddress')
export const updateSelectedToken = createAction<Currency | undefined>(
  'withdraw/updateSelectedToken'
)
export const updateSelectFast = createAction<boolean>(
  'withdraw/updateSelectFast'
)
export const updateWithdrawStatus = createAction<{
  txHash: string
  status: WithdrawStatus
}>('withdraw/updateWithdrawStatus')

export const updateWithdrawing = createAction<boolean>(
  'withdraw/updateWithdrawing'
)

export const fetchTokenReserveAction = createAsyncThunk<
  { tokenId: TokenId; limit: Record<L2ChainId, Wei> },
  { l2CurrencyId: TokenId },
  {
    state: RootState
  }
>(
  'withdraw/fetchTokenReserveAction',
  async ({ l2CurrencyId }, { getState }) => {
    const state = getState()
    const { ethProperty } = state.app
    const { result } = await getTokenReserve(l2CurrencyId, false)

    if (result) {
      const supportGateways = ethProperty.gateways.filter((gateway) =>
        gateway.tokens.some((token) => token.tokenId === l2CurrencyId)
      )
      const gatewaysLimit = compact(
        supportGateways.map((gateway) => result[gateway.chainId])
      )

      if (gatewaysLimit?.length) {
        result[ethProperty.chainId] = maxBigNumber(gatewaysLimit).toString()
      }
    }
    return { tokenId: l2CurrencyId, limit: { ...result } }
  }
)

export const fetchWithdrawalTransactions = createAsyncThunk<
  {
    total: number
    list: TransactionHistoryDetail[]
  },
  {
    page: number
    pageSize: number
  },
  {
    state: RootState
  }
>(
  'withdraw/fetchWithdrawalTransactions',
  async ({ page, pageSize }, { getState }) => {
    const { account } = getState()
    const { accountInfo } = account ?? {}
    const { address = '' } = accountInfo ?? {}

    if (!address) {
      return { total: 0, list: [] }
    }

    const { result } = await getAccountTransactionHistory(
      'Withdraw',
      address,
      page,
      pageSize
    )

    return {
      total: result.totalPageNum,
      list: result.pageData,
    }
  }
)

export const updateWithdrawalTransactions = createAction<{
  total: number
  list: TransactionHistoryDetail[]
}>('withdraw/updateWithdrawalTransactions')
