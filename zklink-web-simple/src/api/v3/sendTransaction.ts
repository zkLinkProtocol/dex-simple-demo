import { TxChangePubKeyData } from 'utils/signer/transactions/changePubKey'
import { TxTransferData } from 'utils/signer/transactions/transfer'
import { TxWithdrawData } from 'utils/signer/transactions/withdraw'
import { TxEthSignature } from 'utils/signer/types'
import { jsonrpc } from './jsonrpc'

export type TxHash = string
export async function sendTransaction(
  tx: TxChangePubKeyData | TxTransferData | TxWithdrawData,
  ethSignature: TxEthSignature | undefined
) {
  return await jsonrpc<TxHash>('sendTransaction', [tx, ethSignature, null])
}
