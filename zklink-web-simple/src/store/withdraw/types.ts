import { AddressBookRow } from 'api/v1/addressBook'
import { TransactionHistoryDetail } from 'api/v3/getAccountTransactionHistory'
import { Currency } from 'api/v3/tokens'
import { Ether, L2ChainId, TokenId, Wei } from 'types'

export enum WithdrawStatus {
  Loading = 'Loading',
  Processing = 'Processing',
  Success = 'Success',
  Fail = 'Fail',
}
export interface BrokerHashItem {
  layerTwoChainId: L2ChainId
  brokerHash: string
  txHash: string
}
export enum WithdrawLayoutType {
  Withdraw,
  Transfer,
}
export interface WithdrawState {
  layoutType: WithdrawLayoutType
  titleName: string
  showAddressBookList: boolean
  isFocus: boolean
  showAddAddress: boolean
  isUseAddressBook: boolean
  addOrEditAddress: string
  amount: Ether
  addressBookList: AddressBookRow[]
  currentEditAddressBook: AddressBookRow | undefined
  currentUseAddressBook: AddressBookRow | undefined
  isAddOrEditAddressBook: number | undefined
  address: string
  selectedToken: Currency | undefined
  selectFast: boolean
  withdrawStatus: {
    [x: string]: WithdrawStatus
  }
  txHash: []
  withdrawing: boolean
  withdrawLimit: {
    pending: boolean
    [x: TokenId]: Record<L2ChainId, Wei>
  }

  transactions: {
    pending: boolean
    list: TransactionHistoryDetail[]
    total: number
  }
}
