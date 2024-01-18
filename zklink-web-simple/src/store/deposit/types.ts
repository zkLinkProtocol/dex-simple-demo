import { TransactionResponse } from '@ethersproject/abstract-provider'
import { TxHash } from 'api/v3/sendTransaction'
import { Currency } from 'api/v3/tokens'
import {
  Address,
  Ether,
  L1ChainId,
  L2ChainId,
  Timestamp,
  TokenId,
  Wei,
} from 'types'

export interface DepositETHTransaction {
  ethResponse: TransactionResponse
  layerOneChainId: L1ChainId
  createdAt: Timestamp
  tokenSymbol: string
  amount: Wei
  ethHash: string
  chainId: L2ChainId
  toAddress: Address
  currencyId: TokenId
  tx: {
    fromChainId: L2ChainId
    l1SourceToken: number
    ethHash: string
    depositTo: Address
  }
  txReceipt?: {
    failReason?: string
    success?: boolean
  }
}
export enum DepositStatus {
  Loading, // Initial status before the blockchain request is returned
  BlockPending, // Waiting blockchain execution
  BlockConfirmations, // Waiting blockchain confirmations number to reach the threshold
  BlockFailed, // Blockchain execution failed
  BlockConfirmed, // Blockchain confirmations completed, waiting zkLink confirm
  ZkLinkConfirmed, // zkLink completed, waiting for Nexus confirm
}
export interface EthHashItem {
  hash: string
  chainId: L1ChainId
}

export enum DepositModalOption {
  SelectOption,
  SelectAssets,
  Qrcode,
}

export interface ExTokenWithBalance extends Currency {
  available?: Wei
  hold?: Wei
}

export interface TransactionsState {
  pendingTxs: DepositETHTransaction[]
  depositStatus: {
    [x: string]: DepositStatus
  }
  modalOption: DepositModalOption
  isMobilePage: boolean
  ethHash: EthHashItem[]
  txConfirmations: Record<TxHash, number>
  queryL2Hash: string[]
  depositing: boolean
  amount: Ether
  selectedToken: Currency | undefined
}
