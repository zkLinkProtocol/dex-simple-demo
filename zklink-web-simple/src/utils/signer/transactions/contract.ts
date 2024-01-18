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

export interface SignContractPayload {
  accountId: number // layer2 account id, e.g. 0
  subAccountId: number // sub account id, e.g. 0
  slotId: number // slot id, e.g. 0
  nonce: number // slot nonce, e.g. 0
  pairId: number // contract symbol id, e.g. 0
  size: string // packed token amount, e.g. '1000000000000000000'
  price: string // token price, e.g. '1000000000000000000'
  direction: boolean // false -> short, true -> long
  // in the subsidy order, the maker will be negative, and the taker will be positive
  feeRates: [number, number] // [maker, taker], e.g. [100, 255] 100 means 1%, max is 255, value must be between 0 and 255
  // determine final value via feeRates[0] integer type
  hasSubsidy?: boolean // optional false -> pay fee, true -> subsidy
}

export interface TxContractData {
  accountId: number // layer2 account id, e.g. 0
  subAccountId: number // sub account id, e.g. 0
  slotId: number // slot id, e.g. 0
  nonce: number // slot nonce, e.g. 0
  pairId: number // contract symbol id, e.g. 0
  size: string // packed token amount, e.g. '1000000000000000000'
  price: string // token price, e.g. '1000000000000000000'
  direction: 0 | 1 // 0 -> short, 1 -> long
  feeRates: [number, number] // converted positive integer array
  hasSubsidy: 0 | 1 // 0 -> pay fee, 1 -> subsidy
  signature: TxSignature
}

export interface SignedContractData {
  tx: TxContractData
}

export async function signContract(
  signer: sdk.JsonRpcSigner,
  payload: SignContractPayload
): Promise<SignedContractData> {
  const packedSize = sdk.closestPackableTransactionAmount(payload.size)

  const hasSubsidy = payload.hasSubsidy ?? payload.feeRates[0] <= 0

  assert(signer != undefined, 'Signer is undefined')
  assertAccountId(payload?.accountId, 'Contract')
  assertTypeNumber(payload?.subAccountId, 'Missing or invalid "subAccountId"')
  assertTypeNumber(payload?.slotId, 'Missing or invalid "slotId"')
  assertNonce(payload?.nonce, 'Contract')
  assertTypeNumber(payload?.pairId, 'Missing or invalid "pairId"')
  assertTypeString(payload.size, 'Missing or invalid "size"')
  assertTypeString(payload.price, 'Missing or invalid "price"')
  assertTypeBoolean(payload.direction, '"direction" must be boolean')
  assertTypeArray(payload.feeRates, '"feeRates" must be an array')
  assertTradingFeeRatio(payload.feeRates[0], 'Contract')
  assertTradingFeeRatio(payload.feeRates[1], 'Contract')
  assertTypeBoolean(hasSubsidy, '"hasSubsidy" must be boolean')

  const builder = new sdk.ContractBuilder(
    payload.accountId,
    payload.subAccountId,
    payload.slotId,
    payload.nonce,
    payload.pairId,
    packedSize,
    payload.price,
    payload.direction,
    Math.abs(payload.feeRates[0]),
    payload.feeRates[1],
    hasSubsidy
  )

  const contractData = sdk.newContract(builder)
  const signed = signer.createSignedContract(contractData)

  return {
    tx: signed,
  }
}
