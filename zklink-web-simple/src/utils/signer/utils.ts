import { SUB_ACCOUNT_ID } from 'config'
import { isAddress } from 'ethers/lib/utils'
import init, * as sdk from 'zklink-web-sdk-alpha'

export { sdk }

let initialized = false
export async function initSdk() {
  if (!initialized) {
    await init()
    initialized = true
  }
}

export function timestamp(): number {
  return Math.floor(Date.now() / 1000)
}

export function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

assert.address = assertAddress
export function assertTypeArray(value: any, message: string) {
  assert(value instanceof Array, message)
}
export function assertTypeBoolean(value: any, message: string) {
  assert(typeof value === 'boolean', message)
}
export function assertTypeNumber(value: any, message: string) {
  assert(typeof value === 'number', message)
}
export function assertTypeString(value: any, message: string) {
  assert(typeof value === 'string', message)
}
export function assertAddress(value: string, msg: string) {
  assert(isAddress(value), `Invalid address in ${msg}, address: ${value}`)
}
export function assertChainId(value: number, msg: string) {
  assert(
    typeof value === 'number' && value > 0,
    `Invalid chainId in ${msg}, chainId: ${value}`
  )
}
export function assertAccountId(value: number, msg: string) {
  assert(
    typeof value === 'number' && value > 0,
    `Invalid accountId in ${msg}, accountId: ${value}`
  )
}
export function assertSubAccountId(value: number, msg: string) {
  assert(value === SUB_ACCOUNT_ID, 'Invalid subAccountId in ' + msg)
}
export function assertNonce(value: number, msg: string) {
  assert(
    typeof value === 'number' && value >= 0,
    `Invalid nonce in ${msg}, nonce: ${value}`
  )
}
export function assertTokenId(value: number, msg: string) {
  assert(
    typeof value === 'number' && value > 0,
    `Invalid tokenId in ${msg}, tokenId: ${value}`
  )
}
export function assertPubKeyHash(value: string, msg: string) {
  assert(
    typeof value === 'string' && value.length === 42 && value.startsWith('0x'),
    `Invalid pubkey hash in ${msg}, pubkey hash: ${value}`
  )
}
export function assertTs(value: number, msg: string) {
  assert(
    typeof value === 'number' &&
      value > 1700000000 &&
      String(1700000000).length === 10,
    `Invalid timestamp in ${msg}, timestamp: ${value}`
  )
}
export function assertWithdrawFeeRatio(value: number, msg: string) {
  assert(
    typeof value === 'number' && value >= 0 && value <= 10000,
    `Invalid withdraw fee ratio in ${msg}, fee ratio: ${value}`
  )
}
export function assertTradingFeeRatio(value: number, msg: string) {
  assert(
    typeof value === 'number' && value >= -255 && value <= 255,
    `Invalid trading fee ratio in ${msg}, fee ratio: ${value}`
  )
}
