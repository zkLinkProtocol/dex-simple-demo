import { TxSignature } from '../types'
import {
  assert,
  assertAccountId,
  assertNonce,
  assertTradingFeeRatio,
  assertTypeArray,
  assertTypeBoolean,
  assertTypeNumber,
  assertTypeString,
  sdk,
} from '../utils'

export interface SignOrderPayload {
  accountId: number // layer2 account id, e.g. 0
  subAccountId: number // sub account id, e.g. 0
  slotId: number // slot id, e.g. 0
  nonce: number // slot nonce, e.g. 0
  baseTokenId: number // token id, e.g. 0
  quoteTokenId: number // token id, e.g. 0
  amount: string // token amount, e.g. '1000000000000000000'
  price: string // token price, e.g. '1000000000000000000'
  isSell: boolean // false -> buy, true -> sell
  // in the subsidy order, the maker will be negative, and the taker will be positive
  feeRates: [number, number] // [maker, taker], e.g. [100, 255] 100 means 1%, max is 255, value must be between 0 and 255
  // determine final value via feeRates[0] integer type
  hasSubsidy?: boolean // optional false -> pay fee, true -> subsidy
}

export interface TxOrderData {
  accountId: number // layer2 account id, e.g. 0
  subAccountId: number // sub account id, e.g. 0
  slotId: number // slot id, e.g. 0
  nonce: number // slot nonce, e.g. 0
  baseTokenId: number // token id, e.g. 0
  quoteTokenId: number // token id, e.g. 0
  amount: string // packed token amount, e.g. '1000000000000000000'
  price: string // token price, e.g. '1000000000000000000'
  isSell: 0 | 1 // 0 -> buy, 1 -> sell
  feeRates: [number, number] // converted positive integer array
  hasSubsidy: 0 | 1 // 0 -> pay fee, 1 -> subsidy
  signature: TxSignature
}

export interface SignedOrderData {
  tx: TxOrderData
}

export async function signOrder(
  signer: sdk.JsonRpcSigner,
  payload: SignOrderPayload
): Promise<SignedOrderData> {
  const packedAmount = sdk.closestPackableTransactionAmount(payload.amount)

  const hasSubsidy = payload.hasSubsidy ?? payload.feeRates[0] <= 0

  assert(signer != undefined, 'Signer is undefined')
  assertAccountId(payload.accountId, 'Order')
  assertTypeNumber(payload.subAccountId, 'Missing or invalid "subAccountId"')
  assertTypeNumber(payload.slotId, 'Missing or invalid "slotId"')
  assertNonce(payload.nonce, 'Order')
  assertTypeNumber(payload.baseTokenId, 'Missing or invalid "baseTokenId"')
  assertTypeNumber(payload.quoteTokenId, 'Missing or invalid "quoteTokenId"')
  assertTypeString(payload.amount, 'Missing or invalid "amount"')
  assertTypeString(payload.price, 'Missing or invalid "price"')
  assertTypeBoolean(payload.isSell, '"isSell" must be boolean')
  assertTypeArray(payload.feeRates, '"feeRates" must be an array')
  assertTradingFeeRatio(payload.feeRates[0], 'Order')
  assertTradingFeeRatio(payload.feeRates[1], 'Order')
  assertTypeBoolean(hasSubsidy, '"hasSubsidy" must be boolean')

  const builder = new sdk.Order(
    payload.accountId,
    payload.subAccountId,
    payload.slotId,
    payload.nonce,
    payload.baseTokenId,
    payload.quoteTokenId,
    packedAmount,
    payload.price,
    payload.isSell,
    Math.abs(payload.feeRates[0]),
    payload.feeRates[1],
    hasSubsidy
  )
  const signed = signer.createSignedOrder(builder)

  return {
    tx: signed,
  }
}
