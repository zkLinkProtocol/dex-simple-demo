import { TxEthSignature, TxSignature } from '../types'
import {
  assertAccountId,
  assertChainId,
  assertNonce,
  assertPubKeyHash,
  assertSubAccountId,
  assertTokenId,
  assertTs,
  sdk,
  timestamp,
} from '../utils'

export type ChangePubkeyTypes = 'Onchain' | 'EthECDSA' | 'EthCreate2'

export interface ChangePubKeyOnchain {
  type: 'Onchain'
}

export interface ChangePubKeyECDSA {
  type: 'EthECDSA'
  ethSignature: string
}

export interface ChangePubKeyCREATE2 {
  type: 'EthCreate2'
  creatorAddress: string
  saltArg: string
  codeHash: string
}

export interface SignChangePubKeyPayload {
  chainId: number // layer2 chain id, e.g. 1
  accountId: number // layer2 account id, e.g. 0
  subAccountId: number // sub account id, e.g. 0
  feeTokenId: number // token id, e.g. 0
  ethAuthType: ChangePubkeyTypes
  fee: string // fee, e.g. '1000000000000000000'
  nonce: number // account nonce, e.g. 0
  newPkHash?: string // new public key hash, e.g. '0x...'
  account?: string // layer1 address, e.g. '0x...'
  ts?: number // timestamp, e.g. 1629780000
}

export interface TxChangePubKeyData {
  type: 'ChangePubKey'
  chainId: number // layer2 chain id, e.g. 1
  subAccountId: number // sub account id, e.g. 0
  account: string // layer1 address, e.g. '0x...'
  accountId: number // layer2 account id, e.g. 0
  newPkHash: string // new public key hash, e.g. '0x...'
  feeToken: number // token id, e.g. 0
  fee: string // fee, e.g. '1000000000000000000'
  ts: number // timestamp, e.g. 1629780000
  nonce: number // account nonce, e.g. 0
  signature: TxSignature
  ethAuthData?: ChangePubKeyOnchain | ChangePubKeyECDSA | ChangePubKeyCREATE2
}

export interface SignedChangePubKeyData {
  tx: TxChangePubKeyData
  layer1_signature?: TxEthSignature
}

export async function signChangePubKey(
  signer: sdk.JsonRpcSigner,
  payload: SignChangePubKeyPayload
): Promise<SignedChangePubKeyData> {
  const ts = payload.ts || timestamp()
  const newPkHash = payload.newPkHash ?? signer.pubkeyHash()
  const fee = sdk.closestPackableTransactionFee(payload.fee)

  assertChainId(payload.chainId, 'ChangePubKey')
  assertAccountId(payload.accountId, 'ChangePubKey')
  assertSubAccountId(payload.subAccountId, 'ChangePubKey')
  assertPubKeyHash(newPkHash, 'ChangePubKey')
  assertNonce(payload.nonce, 'ChangePubKey')
  assertTokenId(payload.feeTokenId, 'ChangePubKey')
  assertTs(ts, 'ChangePubKey')

  const builder = new sdk.ChangePubKeyBuilder(
    payload.chainId,
    payload.accountId,
    payload.subAccountId,
    newPkHash,
    payload.feeTokenId,
    fee,
    payload.nonce,
    '0x000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001b',
    ts
  )
  const tx = sdk.newChangePubkey(builder)

  if (payload.ethAuthType === 'EthECDSA') {
    return await signer.signChangePubkeyWithEthEcdsaAuth(tx)
  } else if (payload.ethAuthType === 'Onchain') {
    return await signer.signChangePubkeyWithOnchain(tx)
  } else {
    throw new Error('ethAuthType not supported')
  }
}
