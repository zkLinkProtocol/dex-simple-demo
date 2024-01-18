import { TxTransferData } from 'utils/signer/transactions/transfer'
import { TxEthSignature } from 'utils/signer/types'
import { ApiV1Response, http } from './http'

export async function postTransfer<
  T extends ApiV1Response<{ id: number; txHash: string }>
>(tx: TxTransferData, layer1Signature: TxEthSignature): Promise<T> {
  const r = await http.post<T>(`/layer2/repeater`, {
    txData: tx,
    ethSignature: layer1Signature,
  })
  return r.data
}
