import { Address, L2ChainId, Microseconds, Wei } from 'types'
import { jsonrpc } from './jsonrpc'

/*
type": "Withdraw",
                    "toChainId": 7,
                    "accountId": 43,
                    "subAccountId": 0,
                    "to": "0x3498f456645270ee003441df82c718b56c0e6666",
                    "l2SourceToken": 17,
                    "l1TargetToken": 17,
                    "amount": "100000000000000000",
                    "fee": "2240000000000000000",
                    "nonce": 0,
                    "signature": {
                        "pubKey": "0xa019914b6f96f2c63d440157932cea2df50b2cadb8c65e07868e4be3332990a6",
                        "signature": "cb9d0d62760d3750fcc552c7bad8a0d305a6d4b89cd541b3b1517f02262c8b96952f022e85da462cc754b26b3c03c831172b25273a0e546d3b20c6d47422d205"
                    },
                    "withdrawToL1": 0,
                    "withdrawFeeRatio": 0,
                    "ts": 1702972419
                    */
export interface TransactionHistoryDetail {
  chainId: L2ChainId
  fromAccount: Address
  toAccount: Address
  amount: Wei
  nonce: number
  txHash: string
  createdAt: Microseconds
  tx: any
  receipt: {
    executed: boolean
    executedTimestamp: Microseconds
    success: boolean
    failReason: string | null
    block: number
    index: number
  }
}
export interface AccountTransactionHistoryResponse {
  totalPageNum: number
  pageIndex: number
  pageSize: number
  pageData: TransactionHistoryDetail[]
}

export async function getAccountTransactionHistory(
  transactionType: 'Withdraw' | 'Deposit' | 'Transfer',
  address: Address,
  page: number,
  pageSize: number
) {
  return await jsonrpc<AccountTransactionHistoryResponse>(
    'getAccountTransactionHistory',
    [transactionType, address, page, pageSize]
  )
}
