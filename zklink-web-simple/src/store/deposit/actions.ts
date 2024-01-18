import { createAction } from '@reduxjs/toolkit'
import {
  DepositETHTransaction,
  DepositModalOption,
  DepositStatus,
  EthHashItem,
  ExTokenWithBalance,
} from 'store/deposit/types'
import { Ether } from 'types'

export const addDepositPendingTxAction = createAction<DepositETHTransaction>(
  'deposit/addDepositPendingTxAction'
)
export const removeMatchedDepositPendingTxAction = createAction<string[]>(
  'deposit/removeMatchedDepositPendingTxAction'
)
export const updateDepositModalOption = createAction<DepositModalOption>(
  'deposit/DepositModalOption'
)
export const updateIsDepositMobilePage = createAction<boolean>(
  'deposit/updateIsDepositMobilePage'
)
export const updateDepositStatus = createAction<
  {
    ethHash: string
    status: DepositStatus
  }[]
>('deposit/updateDepositStatus')
export const updateQueryL2Hash = createAction<string[]>(
  'deposit/updateQueryL2Hash'
)
export const updateEthHash = createAction<EthHashItem[]>(
  'deposit/updateEthHash'
)

export const updateDepositingAction = createAction<boolean>(
  'deposit/updateDepositingAction'
)

export const updateDepositAmountAction = createAction<Ether>(
  'deposit/updateDepositAmountAction'
)
export const updateDepositTokenAction = createAction<ExTokenWithBalance>(
  'deposit/updateDepositTokenAction'
)
export const updateTxConfirmations = createAction<
  {
    txHash: string
    confirmations: number
  }[]
>('deposit/updateTxConfirmations')
