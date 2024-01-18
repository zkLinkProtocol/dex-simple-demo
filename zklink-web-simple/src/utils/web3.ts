import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'
import { ethers } from 'ethers'
import { findNetworks } from 'store/app/hooks'
import { L2ChainId } from 'types'

export const createWeb3Provider = (): Web3Provider | undefined => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum as any)
  }
  return undefined
}

const web3Providers: {
  [x: number]: Web3Provider | JsonRpcProvider
} = {}
export function getWeb3ProviderByLinkId(
  linkId: L2ChainId
): Web3Provider | JsonRpcProvider | undefined {
  if (web3Providers[linkId]) {
    return web3Providers[linkId]
  } else {
    const network = findNetworks({ layerTwoChainId: linkId })
    if (network) {
      const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl, {
        name: network.name ?? 'unknown',
        chainId: network.chainId,
      })
      web3Providers[linkId] = provider
      return provider
    }
    return undefined
  }
}
