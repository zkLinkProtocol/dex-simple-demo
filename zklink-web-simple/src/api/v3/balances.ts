import { L2AccountId, SubAccountId, TokenId, Wei } from '../../types'
import { jsonrpc } from './jsonrpc'

export interface AccountBalances {
  [x: SubAccountId]: Record<TokenId, Wei>
}

export async function getAccountBalances(accountId: L2AccountId) {
  return await jsonrpc<AccountBalances>('getAccountBalances', [accountId])
}
