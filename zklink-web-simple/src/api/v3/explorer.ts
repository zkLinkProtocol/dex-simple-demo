import { rpcPayload } from 'api/rpc'
import axios from 'axios'
import { ZKLINK_SCAN_API_ENDPOINT } from 'config'

export enum ExplorerTxnStatus {
  Pending = 1,
  L1Completed,
  L2Completed,
  Failed,
}

export interface ExplorerTxnResult {
  account: string
  amount: {
    symbol: string
    token_id: number
    value: string
  }
  blockHeight: number
  brokerFee: {
    symbol: string
    token_id: number
    value: string
  }
  created: number
  extend: {
    claim_hash: string // l2 hash for gateway claim on linea side
    broker_hash: string
    broker_status: 'NotAccepted' | 'AcceptedOk' | 'AcceptedFail'
  }
  fee: {
    symbol: string
    token_id: number
    value: string
  }
  from: {
    hash: string
    level: string
    value: number
  }
  l1Completed: number
  l1Hash: string // l1 hash on ethereum side
  l2Completed: number
  nonce: number
  opType: number
  received: {
    symbol: string
    token_id: number
    value: string
  }
  status: 2 | 3 // 2: L1 Completed, 3: L2 Completed
  to: {
    hash: string
    level: string
    value: number
  }
  totalValue: string
  txnHash: string
}
export interface GetBatchTxnDetailResponse {
  error?: {
    code: number
    message: string
  }
  result?: ExplorerTxnResult[]
}
export async function getBatchTxnDetail(
  txHash: string[]
): Promise<GetBatchTxnDetailResponse> {
  return axios
    .post(``, rpcPayload('batch_txn_detail', [txHash]), {
      baseURL: ZKLINK_SCAN_API_ENDPOINT,
    })
    .then((r) => r.data)
}

export interface GetDepositSearchResponse {
  data: {
    error?: {
      code: number
      message: string
    }
    result?: {
      hashType: string
      detail: string
    }
  }
}
export function getDepositSearch(
  keywords: string
): Promise<GetDepositSearchResponse> {
  return axios.post(``, rpcPayload('search', [{ keywords }]), {
    baseURL: ZKLINK_SCAN_API_ENDPOINT,
  })
}
