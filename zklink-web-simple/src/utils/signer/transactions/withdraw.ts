import { bn } from 'utils/number'
import { TxEthSignature, TxSignature } from '../types'
import {
  assertAccountId,
  assertAddress,
  assertChainId,
  assertNonce,
  assertSubAccountId,
  assertTokenId,
  assertTs,
  assertWithdrawFeeRatio,
  sdk,
  timestamp,
} from '../utils'

export interface SignWithdrawPayload {
  toChainId: number // layer2 chain id, e.g. 1
  withdrawToL1: boolean // withdraw to layer1 or not
  subAccountId: number // sub account id, e.g. 0
  to: string // layer1 address, e.g. '0x...'
  l2SourceTokenId: number // token id, e.g. 0
  l2SourceTokenSymbol: string // token symbol, e.g. 'wETH'
  l1TargetTokenId: number // token id, e.g. 0
  tokenDecimals: number // token decimals, e.g. 18
  amount: string // token amount, e.g. '1000000000000000000'
  withdrawFeeRatio: number // fast withdraw fee ratio, e.g. 50 for 0.005%
  accountId: number // layer2 account id, e.g. 0
  fee: string // fee, e.g. '1000000000000000000'
  nonce: number // nonce, e.g. 0
  from?: string // layer1 address, e.g. '0x...'
  ts?: number
}

export interface TxWithdrawData {
  type: 'Withdraw'
  toChainId: number // layer2 chain id, e.g. 1
  withdrawToL1: 0 | 1 // withdraw to layer1 or not
  subAccountId: number // sub account id, e.g. 0
  accountId: number // layer2 account id, e.g. 0
  from: string // layer1 address, e.g. '0x...'
  to: string // layer1 address, e.g. '0x...'
  l2SourceToken: number // token id, e.g. 0
  l1TargetToken: number // token id, e.g. 0
  amount: string // token amount, e.g. '1000000000000000000'
  fee: string // fee, e.g. '1000000000000000000'
  withdrawFeeRatio: number // fast withdraw fee ratio, e.g. 50 for 0.005%
  ts: number // timestamp, e.g. 1629780000
  nonce: number // nonce, e.g. 0
  signature: TxSignature
}

export interface SignedWithdrawData {
  tx: TxWithdrawData
  layer1_signature: TxEthSignature
}

export function discardBeyondPrecision(
  amount: string,
  tokenDecimals: number
): string {
  const defaultDecimals = 18

  // Discard quantities beyond the effective precision.
  // e.g. tokenDecimals=6, amount=1234567890000000000. result=1234560000000000000
  if (tokenDecimals < defaultDecimals) {
    const dustDecimals = defaultDecimals - tokenDecimals
    if (dustDecimals < 0) {
      throw new Error(`Invalid token decimals: ${tokenDecimals}`)
    }
    amount = bn(amount)
      .div(10 ** dustDecimals)
      .mul(10 ** dustDecimals)
      .toString()
  }

  return amount
}

export async function signWithdraw(
  signer: sdk.JsonRpcSigner,
  payload: SignWithdrawPayload
): Promise<SignedWithdrawData> {
  const ts = payload.ts || timestamp()

  const amount = discardBeyondPrecision(payload.amount, payload.tokenDecimals)

  const packedAmount = sdk.closestPackableTransactionAmount(amount)
  const packedFee = sdk.closestPackableTransactionFee(payload.fee)

  assertChainId(payload.toChainId, 'Withdraw')
  assertAccountId(payload.accountId, 'Withdraw')
  assertSubAccountId(payload.subAccountId, 'Withdraw')
  assertAddress(payload.to, 'Withdraw')
  assertTokenId(payload.l2SourceTokenId, 'Withdraw')
  assertTokenId(payload.l1TargetTokenId, 'Withdraw')
  assertNonce(payload.nonce, 'Withdraw')
  assertWithdrawFeeRatio(payload.withdrawFeeRatio, 'Withdraw')
  assertTs(ts, 'Withdraw')

  const builder = new sdk.WithdrawBuilder(
    payload.accountId,
    payload.subAccountId,
    payload.toChainId,
    payload.to,
    payload.l2SourceTokenId,
    packedFee,
    payload.withdrawFeeRatio,
    payload.l1TargetTokenId,
    packedAmount,
    payload.nonce,
    payload.withdrawToL1,
    ts
  )
  const tx = sdk.newWithdraw(builder)
  const signed = await signer.signWithdraw(tx, payload.l2SourceTokenSymbol)

  return signed
}
