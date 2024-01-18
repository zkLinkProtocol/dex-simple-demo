import { jsonrpc } from './jsonrpc'

export type Microseconds = number
export interface TransactionReceipt {
  txHash: string
  tx: any
  receipt: {
    executed: boolean
    executedTimestamp: Microseconds
    success: boolean
    failReason: string | null
    block: number
    index: number
  }
  updates: []
}

export async function getTransactionByHash(txHash: string) {
  return await jsonrpc<TransactionReceipt>('getTransactionByHash', [
    txHash,
    false,
  ])
}
