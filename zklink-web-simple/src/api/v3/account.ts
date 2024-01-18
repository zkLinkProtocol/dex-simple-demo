import { SUB_ACCOUNT_ID } from 'config'
import { AccountNonce, Address } from 'types'
import { jsonrpc } from './jsonrpc'

export interface AccountInfo {
  id: number
  address: Address
  nonce: number
  pubKeyHash: Address
  subAccountNonces: Record<string, number> // <SubAccountId, Nonce>
}

export async function getAccount(address: Address) {
  return await jsonrpc<AccountInfo>('getAccount', [address])
}

export async function getAccountNonce(
  address: Address,
  nonceType = 1 | 2 // 1: main account, 2: subaccount
): Promise<AccountNonce> {
  const { result } = await getAccount(address)

  if (nonceType === 1) {
    return result?.nonce
  } else if (nonceType === 2) {
    return result?.subAccountNonces[String(SUB_ACCOUNT_ID)] ?? 0
  }

  throw new Error('Fetch the account failed')
}
