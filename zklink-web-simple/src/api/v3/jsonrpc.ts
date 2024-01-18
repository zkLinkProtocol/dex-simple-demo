import axios from 'axios'
import { ZKLINK_ENDPOINT } from 'config'

export const zklinkAxios = axios.create({
  baseURL: ZKLINK_ENDPOINT,
})

export interface RpcResponseResult<T> {
  jsonrpc: '2.0'
  result: T
  id: 1
}

export interface RpcResponseError {
  jsonrpc: '2.0'
  error: {
    code: number
    message: string
    data: string
  }
  id: 1
}

export type RpcResponse<T> = RpcResponseResult<T> | RpcResponseError

export type zklinkRpcMethods =
  | 'getAccount'
  | 'getSupportChains'
  | 'getSupportTokens'
  | 'getEthProperty'
  | 'getChangePubkeyChainId'
  | 'getAccountBalances'
  | 'getTransactionByHash'
  | 'getTokenReserve'
  | 'sendTransaction'
  | 'getAccountTransactionHistory'

export async function jsonrpc<T>(
  method: zklinkRpcMethods,
  params: any[]
): Promise<RpcResponseResult<T>> {
  const r = await zklinkAxios.post<RpcResponse<T>>('', {
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  })

  if ((r.data as RpcResponseError)?.error) {
    const error = (r.data as RpcResponseError).error
    throw new Error(`[${error.code}] ${error.message} ${error.data}`)
  }

  return r.data as RpcResponseResult<T>
}
