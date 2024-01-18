import { Web3Provider } from '@ethersproject/providers'
import i18n from 'i18n'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState, store } from 'store'
import { updateModal } from 'store/app/actions'
import {
  useGateways,
  useSpotCurrencies,
  useSupportChains,
} from 'store/app/hooks'
import { updateLinkStatus, updateLinkWallet } from 'store/link/actions'
import { Address, L1ChainId, TokenId, TokenSymbol, Wei } from 'types'
import { initSdk, sdk } from 'utils/signer/utils'
import { LinkStatus } from './types'

export function useLinkWallet() {
  return useSelector<RootState, sdk.JsonRpcSigner | undefined>(
    (state) => state.link.signer
  )
}

export function useLinkConnected() {
  return useSelector<RootState, boolean>((state) => state.link.connected)
}

export function useViewInExplorerLink() {
  return useSelector<RootState, string>(
    (state) => state.link.viewInExplorerLink
  )
}

export function useLinkStatus() {
  return useSelector<RootState, LinkStatus>((state) => state.link.linkStatus)
}

const connectByEvmProvider = async (provider: Web3Provider) => {
  if (!provider) {
    throw new Error('Web3Provider not found')
  }
  if (!provider.provider) {
    throw new Error('ExternalProvider not found')
  }

  const network = await provider.detectNetwork()
  if (!network?.chainId) {
    throw new Error('Cannot detect network')
  }

  const web3Signer = provider.getSigner()
  const address = await web3Signer.getAddress()
  if (!address) {
    throw new Error(i18n.t('common-not-address'))
  }

  const chainId = network.chainId

  const newSigner = sdk.newRpcSignerWithProvider(provider.provider)

  return {
    address,
    chainId,
    newSigner,
  }
}

export async function connectLinkWallet(provider: Web3Provider) {
  const { dispatch, getState } = store
  try {
    dispatch(updateLinkStatus(LinkStatus.linkL2Pending))
    if (!provider) {
      throw new Error('Web3Provider not found')
    }
    await initSdk()

    const { address, chainId, newSigner } = await connectByEvmProvider(
      provider as Web3Provider
    )

    // TODO: sdk not support hex string to restore signer
    // Seed may be empty string, however, starknet is not support empty string seed, must be undefined or hex string
    await newSigner.initZklinkSigner()

    dispatch(updateLinkWallet({ signer: newSigner, chainId }))
    dispatch(updateLinkStatus(LinkStatus.linkL2Success))
    dispatch(updateModal({ modal: 'wallets', open: false }))
  } catch (e) {
    dispatch(updateLinkStatus(LinkStatus.linkL2Failed))
  }
}

export function useEthereumTokenInfo(
  l1ChainId: L1ChainId,
  tokenId: TokenId
):
  | {
      id: TokenId
      symbol: TokenSymbol
      address: Address
      decimals: number
      fastWithdraw: boolean
    }
  | undefined {
  const supportChains = useSupportChains()
  const spotCurrencies = useSpotCurrencies()
  const gateways = useGateways()
  return useMemo(() => {
    if (!l1ChainId || !tokenId) {
      return
    }
    const chain = supportChains.find(
      (chain) => chain.layerOneChainId === l1ChainId
    )
    if (!chain) {
      return
    }

    const currency = spotCurrencies.find(
      (currency) => currency.l2CurrencyId === tokenId
    )

    if (!currency) {
      return
    }

    const { chains } = currency ?? {}

    const tokenChain = chains[chain.layerTwoChainId]
    if (!tokenChain) {
      return
    }
    return {
      id: currency.l2CurrencyId,
      symbol: currency.l2Symbol,
      address: tokenChain.address,
      decimals: tokenChain.decimals,
      fastWithdraw: tokenChain.fastWithdraw,
    }
    // }
  }, [supportChains, gateways, spotCurrencies, l1ChainId, tokenId])
}

export function useEthereumTokenBalance(
  l1ChainId: L1ChainId,
  tokenId: TokenId
) {
  const token = useEthereumTokenInfo(l1ChainId, tokenId)

  return useSelector<RootState, Wei | undefined>((state) => {
    if (
      !token?.address ||
      !state.link.ethereumBalances[l1ChainId] ||
      !state.link.ethereumBalances[l1ChainId][token.address]
    ) {
      return ''
    }
    return state.link.ethereumBalances[l1ChainId][token.address]
  })
}
