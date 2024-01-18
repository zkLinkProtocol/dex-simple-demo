import { Address, L2AccountId, L2ChainId, Timestamp, TokenId } from 'types'
import { http } from './http'

export interface GetWithdrawItem {
  chainId: number // 1
  fromAccount: string // '0x3498f456645270ee003441df82c718b56c0e6666'
  toAccount: string // '0x3498f456645270ee003441df82c718b56c0e6666'
  amount: string // '10000000000000000000000000'
  nonce: number // 20
  txHash: string // 'sync-tx:4d97afc4de31cea64b88a10131178a30c1eac44e3ecdb375eb6dd26e5b9615fc'
  createdAt: string // '2022-11-08T09:19:00.919567Z'
  tx: {
    type: string // 'Deposit'
    toChainId: number // 1
    accountId: number //16,
    subAccountId: number // 1
    to: string // '0x3498f456645270ee003441df82c718b56c0e6666'
    l2SourceToken: number // 18
    l1TargetToken: number // 18
    amount: string // '10000000000000000000000000'
    fee: string // '1872000000000000'
    nonce: number // 1
    fastWithdraw: number // 0
    withdrawFeeRatio: number // 50
    ts: number // 1667969909
    signature: {
      pubKey: string // '84bf4edbe1f7056f079ba4c38359427f43d529fbab2e94e6d6b7a18efbf2fb87'
      signature: string // '6b24cc091413181e03189e3c68d2a189e18ed8e47858629960245276927abf141eafb62f80ef2637464ddec1e1a65e7a3e20ce3b392357a8b0cbd9caec468203'
    }
  }
  txReceipt: {
    executed: boolean // true
    success: boolean // true
    failReason: string | null // null
    block: number // 265
    index: number // 0
  }
}
export enum HistoryType {
  Deposit = 'DEPOSIT',
  Withdraw = 'WITHDRAW',
  Transfer = 'TRANSFER',
}
export interface HistoryParams {
  pageIndex: number
  pageSize: number
  type: HistoryType
  account: number
}
export enum HistoryStatusType {
  padding = 'PENDING',
  fail = 'FAILED',
  success = 'SUCCESS',
}
export interface ApiHistoryItem {
  txId: number
  ethHash?: string // Only for deposit
  userId: number
  accountId: number
  l2AccountId: L2AccountId
  txHash: string
  txType: HistoryType
  txStatus: HistoryStatusType
  chainId: L2ChainId
  fromAddress: Address
  toAddress: Address
  currencyId: TokenId
  fee: number
  amount: number
  extra: string // E.g. "{\"withdrawFeeRatio\":0,\"withdrawToL1\":0}"
  newPkHash: string
  nonce: number
  ts: Timestamp
  pubKey: string
  signature: string
  ethAuthData: string
  ethSignature: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
export function getHistoryListApi(params: HistoryParams): Promise<{
  data: {
    results: ApiHistoryItem[]
    total: number
  }
}> {
  const { pageIndex, pageSize, type, account } = params
  return http
    .get(`/account/${account}/transactions`, {
      params: {
        pageIndex,
        pageSize,
        type,
      },
    })
    .then((r) => r.data)
}
