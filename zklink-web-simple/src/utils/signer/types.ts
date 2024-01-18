export interface TxEthSignature {
  type: 'EthereumSignature' | 'EIP1271Signature'
  signature: string
}

export interface TxSignature {
  pubKey: string // hex string, e.g. '0x...'
  signature: string // hex string without '0x', e.g. 'aa...'
}
