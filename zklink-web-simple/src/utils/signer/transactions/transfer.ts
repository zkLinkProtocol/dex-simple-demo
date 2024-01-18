import { TxEthSignature, TxSignature } from '../types'
import {
  assertAccountId,
  assertAddress,
  assertNonce,
  assertSubAccountId,
  assertTokenId,
  assertTs,
  sdk,
  timestamp,
} from '../utils'

export interface SignTransferPayload {
  accountId: number // layer2 account id, e.g. 0
  to: string // layer1 address, e.g. '0x...'
  fromSubAccountId: number // sub account id, e.g. 0
  toSubAccountId: number // sub account id, e.g. 0
  tokenId: number // token id, e.g. 0
  tokenSymbol: string // token symbol, e.g. 'wETH'
  amount: string // token amount, e.g. '1000000000000000000'
  fee: string // fee, e.g. '1000000000000000000'
  nonce: number // nonce, e.g. 0
  ts?: number // timestamp, e.g. 1629780000
}

export interface TxTransferData {
  type: 'Transfer'
  accountId: number
  fromSubAccountId: number
  toSubAccountId: number
  to: string // layer1 address, e.g. '0x...'
  token: number // token id
  amount: string // token amount, e.g. '1000000000000000000'
  fee: string // fee, e.g. '1000000000000000000'
  ts: number // timestamp, e.g. 1629780000
  nonce: number
  signature: TxSignature
}

export interface SignedTransferData {
  tx: TxTransferData
  layer1_signature: TxEthSignature
}

export async function signTransfer(
  signer: sdk.JsonRpcSigner,
  payload: SignTransferPayload
): Promise<SignedTransferData> {
  const ts = payload.ts || timestamp()

  const packedAmount = sdk.closestPackableTransactionAmount(payload.amount)
  const packedFee = sdk.closestPackableTransactionFee(payload.fee)

  assertAccountId(payload.accountId, 'Transfer')
  assertAddress(payload.to, 'Transfer')
  assertSubAccountId(payload.fromSubAccountId, 'Transfer')
  assertSubAccountId(payload.toSubAccountId, 'Transfer')
  assertNonce(payload.nonce, 'Transfer')
  assertTokenId(payload.tokenId, 'Transfer')
  assertTs(ts, 'Transfer')

  const builder = new sdk.TransferBuilder(
    payload.accountId,
    payload.to,
    payload.fromSubAccountId,
    payload.toSubAccountId,
    payload.tokenId,
    packedFee,
    packedAmount,
    payload.nonce,
    ts
  )
  const tx = sdk.newTransfer(builder)
  const signed = await signer.signTransfer(tx, payload.tokenSymbol)

  return signed
}
