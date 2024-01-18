import { TransactionResponse } from '@ethersproject/abstract-provider'
import { Logger } from '@ethersproject/logger'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import {
  ERC20_INTERFACE,
  ZKLINK_GATEWAY_CONTRACT_INTERFACE,
  ZKLINK_MAIN_CONTRACT_INTERFACE,
} from 'abi'
import { getGatewayScheduling } from 'api/v3/scheduling'
import { TxHash } from 'api/v3/sendTransaction'
import { Currency } from 'api/v3/tokens'
import toastify from 'components/Toastify'
import { SUB_ACCOUNT_ID } from 'config'
import {
  BlockedDepositChains,
  DEPOSIT_PENDING_TRANSACTION_TIMEOUT,
  DefaultDepositConfirmations,
  DefaultDepositEstimateMinutes,
  DepositConfirmations,
  DepositEstimateMinutes,
  MAX_ERC20_APPROVE_AMOUNT,
} from 'config/deposit'
import dayjs from 'dayjs'
import { BigNumber, BigNumberish, ethers, utils } from 'ethers'
import { formatUnits, isAddress } from 'ethers/lib/utils'
import { compact, concat, unionBy } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, store } from 'store'
import { useIsLogin } from 'store/account/hooks'
import { updateModal } from 'store/app/actions'
import {
  findNetworks,
  useAddress,
  useGateways,
  useModal,
  useSpotCurrencies,
  useSupportChains,
} from 'store/app/hooks'
import {
  addDepositPendingTxAction,
  updateDepositingAction,
} from 'store/deposit/actions'
import { updateViewInExplorerLink } from 'store/link/actions'
import {
  Address,
  Ether,
  L1ChainId,
  TokenAddress,
  TokenId,
  TokenSymbol,
} from 'types'
import { isGasAddress } from 'utils/address'
import { checkMainContractExists } from 'utils/checkMainContractExists'
import { getRecommendedDepositGasLimit } from 'utils/depositGasLimit'
import { bn, parseEtherToWei } from 'utils/number'
import {
  DepositETHTransaction,
  DepositModalOption,
  DepositStatus,
} from './types'

export function useUnexpiredDepositTransactions() {
  const transactions = useSelector<RootState, DepositETHTransaction[]>(
    (state) => state.deposit.pendingTxs
  )
  const address = useAddress()
  const isLogin = useIsLogin()
  return useMemo(() => {
    if (!isLogin || !address) {
      return []
    }
    const now = new Date().getTime()
    return transactions?.filter((item) => {
      return (
        now - dayjs(item.createdAt).valueOf() <=
          DEPOSIT_PENDING_TRANSACTION_TIMEOUT &&
        address === item?.ethResponse?.from
      )
    })
  }, [transactions, address, isLogin])
}

export function useDepositStatus(ethHash: string) {
  return useSelector<RootState, DepositStatus>(
    (state) => state.deposit.depositStatus[ethHash]
  )
}
export function useQueryL2Hash() {
  return useSelector<RootState, string[]>((state) => state.deposit.queryL2Hash)
}

export function useTxConfirmationsByHash(txHash: TxHash) {
  return useSelector<RootState, number>(
    (state) => state.deposit.txConfirmations[txHash] ?? 0
  )
}

export function useDepositModalOption() {
  return useSelector<RootState, DepositModalOption>(
    (state) => state.deposit.modalOption
  )
}

export function useIsDepositMobilePage() {
  return useSelector<RootState, boolean>((state) => state.deposit.isMobilePage)
}

export function getDefaultDepositConfirmations(chainId: L1ChainId): number {
  return DepositConfirmations[chainId] ?? DefaultDepositConfirmations
}

export function getDepositsEstimateMinutes(chainId: L1ChainId): number {
  return DepositEstimateMinutes[chainId] ?? DefaultDepositEstimateMinutes
}

export async function sendDepositFromEthereum(
  provider: ethers.providers.JsonRpcProvider,
  deposit: {
    chainId: L1ChainId
    from: Address
    subAccountId: number
    depositTo: Address
    token: TokenAddress
    amount: BigNumberish
    mapping: boolean
    ethTxOptions?: ethers.providers.TransactionRequest
    approveDepositAmountForERC20?: boolean
  }
): Promise<TransactionResponse> {
  try {
    store.dispatch(updateDepositingAction(true))

    let ethTransaction: TransactionResponse

    if (!isAddress(deposit.token)) {
      throw new Error('Token address is invalid')
    }
    const depositTo = utils.zeroPad(deposit.depositTo, 32)

    const currentNetwork = findNetworks({
      layerOneChainId: deposit.chainId,
    })
    if (!currentNetwork) {
      throw new Error(`Unknown network ${deposit.chainId}`)
    }

    let { mainContract, gateway } = currentNetwork

    // Deposit on Ethereum requires fetching the preferred gateway from the gateway scheduling system.
    if (gateway) {
      const priorityGateway = await getGatewayScheduling(
        store.getState().app.ethProperty.gateways
      )
      if (!priorityGateway) {
        throw new Error(`No available gateway found`)
      }
      // Update mainContract with values from the preferred gateway.
      mainContract = priorityGateway.l1GatewayContract
    }

    if (!mainContract) {
      throw new Error('Main contract address is invalid')
    }

    await checkMainContractExists(provider, deposit.chainId, mainContract)

    if (isGasAddress(deposit.token)) {
      const data = ZKLINK_MAIN_CONTRACT_INTERFACE.encodeFunctionData(
        'depositETH',
        [depositTo, deposit.subAccountId]
      )
      const tx = {
        ...deposit.ethTxOptions,
        from: deposit.from,
        to: mainContract,
        data,
        value: deposit.amount.toString(),
      }
      ethTransaction = await provider.getSigner().sendTransaction(tx)
    } else {
      const allowanceData = ERC20_INTERFACE.encodeFunctionData('allowance', [
        deposit.from,
        mainContract,
      ])

      const allowance = await provider.call({
        to: deposit.token,
        data: allowanceData,
      })

      const approve = BigNumber.from(allowance).lt(deposit.amount)

      // ERC20 token deposit
      let nonce: number = 0
      if (approve) {
        const data = ERC20_INTERFACE.encodeFunctionData('approve', [
          mainContract,
          MAX_ERC20_APPROVE_AMOUNT,
        ])
        const approveTx = await provider.getSigner().sendTransaction({
          from: deposit.from,
          to: deposit.token,
          data,
        })
        nonce = approveTx.nonce + 1
      }

      const instance = gateway
        ? ZKLINK_GATEWAY_CONTRACT_INTERFACE
        : ZKLINK_MAIN_CONTRACT_INTERFACE
      const data = instance.encodeFunctionData('depositERC20', [
        deposit.token,
        deposit.amount,
        depositTo,
        deposit.subAccountId,
        deposit.mapping,
      ])

      const tx = {
        from: deposit.from,
        to: mainContract,
        data,
        value: bn(0),
        ...deposit.ethTxOptions,
      }

      if (gateway) {
        const estValue = await estimateDepositErc20FeeValue(
          provider,
          mainContract,
          deposit.token
        )
        tx.value = bn(estValue)
      }
      if (nonce) {
        tx.nonce = nonce
      }

      // We set gas limit only if user does not set it using ethTxOptions.
      if (tx.gasLimit == null) {
        if (approve) {
          tx.gasLimit = getRecommendedDepositGasLimit(deposit.chainId)
        }
      }

      ethTransaction = await provider.getSigner().sendTransaction(tx)
    }

    return ethTransaction
  } catch (e) {
    return Promise.reject(e)
  } finally {
    store.dispatch(updateDepositingAction(false))
  }
}

export function useDepositing() {
  return useSelector<RootState, boolean>((state) => state.deposit.depositing)
}

export async function estimateDepositErc20FeeValue(
  provider: JsonRpcProvider,
  zklinkContract: Address,
  tokenContract: Address
) {
  if (!zklinkContract || !tokenContract) {
    return bn(0)
  }
  if (isGasAddress(tokenContract)) {
    return bn(0)
  }
  const instance = new ethers.utils.Interface([
    'function fee() view returns (uint64)',
  ])
  const data = instance.encodeFunctionData('fee', [])
  return await provider.call({
    to: zklinkContract,
    data,
  })
}

export function useDeposit() {
  const openMyAccountModal = useModal('guide')
  const dispatch = useDispatch()
  const { chainId, provider } = useWeb3React()
  const address = useAddress()
  return useCallback(
    async function deposit({
      tokenId,
      tokenAddress,
      tokenSymbol,
      amount,
      decimals,
    }: {
      tokenId: TokenId
      tokenAddress: Address
      tokenSymbol: TokenSymbol
      amount: BigNumber
      decimals: number
    }) {
      const state = store.getState()
      try {
        if (!amount || !BigNumber.isBigNumber(amount) || Number(amount) < 0) {
          return
        }
        if (!chainId) {
          throw new Error(`Deposit: Unknown chainId, ${chainId}`)
        }
        const network = findNetworks({ layerOneChainId: chainId })

        if (!network) {
          throw new Error(`Deposit: Cannot find network, ${chainId}`)
        }
        dispatch(updateDepositingAction(true))

        if (!provider) {
          throw new Error(`Deposit: provider is undefined, ${chainId}`)
        }

        let { layerOneChainId, layerTwoChainId } = network

        const transactionResponse = await sendDepositFromEthereum(provider, {
          chainId: layerOneChainId,
          from: address,
          subAccountId: SUB_ACCOUNT_ID,
          depositTo: address,
          token: tokenAddress,
          amount,
          mapping: false,
        }).catch((error) => {
          throw error
        })
        dispatch(
          updateViewInExplorerLink({
            url: `${network.explorerUrl}/tx/${transactionResponse.hash}`,
          })
        )

        // Add a pending tx to store
        dispatch(
          addDepositPendingTxAction({
            ethResponse: transactionResponse,
            layerOneChainId,
            createdAt: Date.now(),
            tokenSymbol,
            // parse the amount to 18 decimals
            amount: parseEtherToWei(formatUnits(amount, decimals)).toString(),
            ethHash: transactionResponse.hash,
            chainId: layerTwoChainId,
            toAddress: address,
            currencyId: tokenId,
            tx: {
              fromChainId: network.layerTwoChainId,
              l1SourceToken: tokenId,
              ethHash: transactionResponse.hash,
              depositTo: address,
            },
          })
        )

        // Show the pending txs modal on footer
        dispatch(updateModal({ modal: 'pendingTxs', open: true }))
      } catch (e) {
        const connectorName = state.settings.connectorName
        // User rejected the tx returned by MetaMask
        if (e?.code === Logger.errors.ACTION_REJECTED) {
        }
        // User rejected the tx returned by anther wallet like Rabby
        else if (e?.code === 4001) {
        } else if (
          e?.message.indexOf('replacement fee too low') > -1 ||
          e?.message.indexOf('transaction underpriced') > -1
        ) {
          toastify.error(
            `The auto-estimated gas fee in your wallet is too low, please try again later, or increase the gas fee manually in your wallet`
          )
        } else if (e?.message.indexOf('cannot estimate gas') > -1) {
          toastify.error(`Transaction may fail or may require manual gas limit`)
        } else if (e?.data?.message) {
          toastify.error(
            `[${connectorName} Error] code: ${e?.code}, ${e?.data?.message}`
          )
        } else {
          toastify.error(`[${connectorName} Error] ${e?.message}`)
          console.error(e)
        }
      } finally {
        dispatch(updateDepositingAction(false))
      }
    },
    [openMyAccountModal, address, chainId, provider]
  )
}

export function useDepositAmount() {
  return useSelector<RootState, Ether>((state) => state.deposit.amount)
}
export function useDepositToken() {
  return useSelector<RootState, Currency | undefined>(
    (state) => state.deposit.selectedToken
  )
}
export function isDepositBlockedChain(chainId: L1ChainId) {
  return BlockedDepositChains.includes(Number(chainId))
}

export const useTokenListOnDeposit = (l1ChainId?: L1ChainId) => {
  const supportChains = useSupportChains()
  const gateways = useGateways()
  const currencies = useSpotCurrencies()

  return useMemo(() => {
    const chanId =
      l1ChainId || supportChains[0]
        ? supportChains[0]?.layerOneChainId
        : undefined

    if (!chanId) {
      return []
    }
    const chain = supportChains.find((v) => v.layerOneChainId === l1ChainId)
    if (!chain) {
      return []
    }

    // If this chian is marked gateway, using the 'tokens' value to filter all token from currencies
    if (chain.gateway) {
      // Get all gateway supported tokens
      const gatewayTokens = unionBy(
        concat(...gateways.map((v) => v.tokens)),
        'tokenId'
      )
      return compact(
        gatewayTokens.map((token) => {
          const currency = currencies.find(
            (currency) => currency.l2CurrencyId === token.tokenId
          )
          return currency!
        })
      )
    }
    // On the source chain using the 'currecies[i].chains[layerTwoChainId]' to filter all currencies
    else {
      return currencies.filter(
        (v) => v.chains && v.chains[chain.layerTwoChainId] !== undefined
      )
    }
  }, [currencies, supportChains, gateways, l1ChainId])
}
