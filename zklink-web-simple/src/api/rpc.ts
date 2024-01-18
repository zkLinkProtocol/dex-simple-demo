export interface RPCPayload<M = string, T = any> {
  jsonrpc: '2.0'
  method: M
  params: T
  id: 1
}

export interface RPCResponse<T = any> {
  id: number
  jsonrpc: string
  result: T
}

export const rpcPayload = (method: string, params: any[]) => {
  return { jsonrpc: '2.0', method, params, id: 1 }
}
