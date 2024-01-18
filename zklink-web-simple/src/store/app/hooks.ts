import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { ChainInfo } from 'api/v3/chains'
import { EthProperty, GatewayInfo } from 'api/v3/ethProperty'
import { Currency } from 'api/v3/tokens'
import {
  BLOCKED_TOKENS,
  PRIMARY_CURRENCY,
  PRIMARY_CURRENCY_PRICE,
} from 'config/currencies'
import { setRecentConnectionMeta } from 'connection/meta'
import { BigNumber } from 'ethers'
import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { signoutAction } from 'store/account/actions'
import { useAccountBalances, useCurrencyBalance } from 'store/account/hooks'
import { clearHistoryAction } from 'store/history/actions'
import {
  disconnectLink,
  updateActivating,
  updateLinkStatus,
} from 'store/link/actions'
import { LinkStatus } from 'store/link/types'
import { updateSaveToken } from 'store/settings/actions'
import { L1ChainId, L2ChainId, TokenSymbol, Wei } from 'types'
import { equalByUpperCase } from 'utils/address'
import authorization from 'utils/authorization'
import { bn, e2w, w2e } from 'utils/number'
import restore from 'utils/restore'
import { isMappingToken, isUSD } from 'utils/tokens'
import { RootState, store } from '../index'
import { cleanModal, updateCurrentNetwork } from './actions'
import { ActionState, ModalState, StaticContracts } from './types'

export function useWeb3Connected() {
  const {
    account = '',
    isActive = false,
    isActivating = false,
  } = useWeb3React()
  return isActive && !!account
}

export function useAddress() {
  const { account = '' } = useWeb3React()
  return account
}

export function useOpenRenderFlag() {
  return useSelector<RootState, number>((state) => state.app.openRenderFlag)
}

export function useActionState(action: keyof ActionState) {
  return useSelector<RootState, boolean>(
    (state) => state.app.actionState[action]
  )
}

export function useModal(modal: keyof ModalState) {
  return useSelector<RootState, boolean>((state) => state.app.modal[modal])
}

export function useFaucetQueueLen() {
  return useSelector<RootState, number>((state) => state.app.faucetQueueLen)
}

export function useContracts(): StaticContracts {
  const contracts = useSelector<RootState, StaticContracts>(
    (state) => state.app.contracts
  )

  return useMemo(() => {
    if (contracts) {
      return contracts
    }
    return {
      multicall: {},
      faucet: {},
    }
  }, [contracts])
}

export function useSwitchNetwork() {
  const { connector } = useWeb3React<Web3Provider>()
  return useCallback(
    async (chainId: L1ChainId) => {
      const network = findNetworks({ layerOneChainId: chainId })
      // Try to add the network to the user's wallet
      if (network) {
        const chainParameters = {
          chainId: Number(chainId),
          chainName: network.name,
          nativeCurrency: {
            name: network.symbol,
            symbol: network.symbol,
            decimals: network.decimals,
          },
          rpcUrls: [network.rpcUrl],
          blockExplorerUrls: [network.explorerUrl],
        }
        console.log('🚀 ~ chainParameters:', chainParameters)
        // chainId is a hex string, need to convert to number
        await connector.activate(chainParameters)
      } else {
        // chainId is a hex string, need to convert to number
        await connector.activate(Number(chainId))
      }
    },
    [connector]
  )
}

export function changeAccount() {
  const { dispatch } = store

  dispatch(updateLinkStatus(LinkStatus.linkL1Success))
  dispatch(disconnectLink())
  dispatch(signoutAction())
  dispatch(updateCurrentNetwork(0))
  dispatch(clearHistoryAction())
  dispatch(updateActivating({ activating: false }))
  dispatch(cleanModal({}))
}

export function disconnectProvider() {
  const { dispatch } = store

  dispatch(updateLinkStatus(LinkStatus.init))
  dispatch(disconnectLink())
  dispatch(signoutAction())
  setRecentConnectionMeta(undefined)
  dispatch(updateCurrentNetwork(0))
  dispatch(clearHistoryAction())
  dispatch(updateActivating({ activating: false }))
  dispatch(cleanModal({}))
}
export function cleanRestore() {
  const { dispatch } = store

  restore.clean()
  authorization.clean()
  dispatch(updateSaveToken(false))
}

export function useCurrentNetwork() {
  const chains = useSelector<RootState, ChainInfo[]>(
    (state) => state.app.chains
  )
  const currentChainId = useSelector<RootState, L1ChainId>(
    (state) => state.app.currentNetwork
  )
  return useMemo(() => {
    const chain = chains.find((v) => v.layerOneChainId === currentChainId)
    if (!currentChainId || !chain) {
      return {
        layerOneChainId: currentChainId,
      } as ChainInfo
    }
    return chain
  }, [chains, currentChainId])
}
export function useIsErrorChain() {
  const supportChains = useSupportChains()
  const currentChain = useSelector<RootState, L1ChainId>(
    (state) => state.app.currentNetwork
  )
  return useMemo(() => {
    const chain = supportChains.find((v) => v.layerOneChainId === currentChain)
    if (currentChain && !chain) {
      return true
    }
    return false
  }, [supportChains, currentChain])
}

export function useSupportChains() {
  const chains = useSelector<RootState, ChainInfo[]>(
    (state) => state.app.chains
  )
  return useMemo(() => {
    return chains.filter((v) => v.isSupport)
  }, [chains])
}

export function useSupportTokens() {
  const tokens = useSelector<RootState, Currency[]>((state) => state.app.tokens)
  return tokens
}

export function useChangePubKeyChainId() {
  return useSelector<RootState, L2ChainId>(
    (state) => state.app.changePubKeyChainId
  )
}

export function useEthProperty() {
  return useSelector<RootState, EthProperty>((state) => state.app.ethProperty)
}

export function useGateways() {
  return useSelector<RootState, GatewayInfo[]>(
    (state) => state.app.ethProperty.gateways
  )
}

export function useUnsupportedChains() {
  const chains = useSelector<RootState, ChainInfo[]>(
    (state) => state.app.chains
  )
  return useMemo(() => {
    return chains.filter((v) => v.isSupport === false)
  }, [chains])
}

export function findNetworks(params?: {
  layerOneChainId?: L1ChainId
  layerTwoChainId?: L2ChainId
}): ChainInfo | undefined {
  const { layerOneChainId, layerTwoChainId } = params ?? {}
  let networks = store.getState()?.app?.chains
  if (layerOneChainId) {
    return networks.find((item) => item.layerOneChainId === layerOneChainId)
  }
  if (layerTwoChainId) {
    return networks.find((item) => item.layerTwoChainId === layerTwoChainId)
  }
  return
}
export function networksChainIds(): L1ChainId[] {
  const networks = store.getState()?.app?.chains
  return networks.map((item) => item.layerOneChainId)
}

export const findSupportChainByLinkChainId = (
  linkChainId: L2ChainId
): ChainInfo | undefined => {
  const supportChains = store.getState()?.app?.chains
  if (
    linkChainId === undefined ||
    linkChainId === null ||
    !supportChains.length
  ) {
    return
  }
  return store.getState()?.app?.chains?.find((item) => {
    return item.layerTwoChainId === linkChainId
  })
}

export function useCurrencies() {
  const currencies = useSelector<RootState, Currency[]>(
    (state) => state.app.tokens
  )
  return useMemo(() => {
    return currencies
      .filter((v) => !isUSD(v.id))
      .filter((v) => !isMappingToken(v.id))
      .filter((v) => !BLOCKED_TOKENS.includes(v.name))
  }, [currencies])
}
export function useTotalAvailableValue(): Wei {
  const balances = useAccountBalances()
  const tokens = useSupportTokens()
  return useMemo(() => {
    if (!balances || !tokens) return '0'
    const value = balances.reduce((prev, current): BigNumber => {
      const price =
        tokens.find((v) => v.id === current.currencyId)?.usdPrice ?? 0
      const value = bn(current.available).mul(e2w(price))
      return prev.add(value)
    }, bn('0'))
    return w2e(value)
  }, [balances, tokens])
}
export function useAvailableBalance(tokenSymbol: TokenSymbol): Wei {
  const price = useCurrencyClosePrice(tokenSymbol)
  const balance = useCurrencyBalance(tokenSymbol)
  return useMemo(() => {
    const { available = '0' } = balance ?? {}

    return available
  }, [balance, price])
}
export function useCurrencyClosePrice(currency: TokenSymbol) {
  const currencies = useCurrencies()
  return useMemo(() => {
    if (!currency) return 0
    if (currency === PRIMARY_CURRENCY) {
      return PRIMARY_CURRENCY_PRICE
    }
    const { usdPrice = 0 } = currencies.find((v) => v.name === currency) ?? {}
    return usdPrice
  }, [currencies, currency])
}
export function useCurrencyById(params: { id?: number; l2Id?: number }) {
  const currencies = useCurrencies()
  return useMemo(() => {
    if (params.id) return currencies.find((v) => v.id === params.id)
    if (params.l2Id)
      return currencies.find((v) => v.l2CurrencyId === params.l2Id)
    return undefined
  }, [currencies, params])
}
export function useCurrencyByName(name: TokenSymbol) {
  const currencies = useCurrencies()
  return useMemo(() => {
    return currencies.find((v) => equalByUpperCase(v.name, name))
  }, [currencies, name])
}
export function useSpotCurrencies(l2ChainId?: L2ChainId) {
  const currencies = useCurrencies()
  return useMemo(() => {
    if (l2ChainId === undefined) {
      return currencies
    } else {
      return currencies.filter(
        (v) => v.chains && v.chains[l2ChainId] !== undefined
      )
    }
  }, [currencies, l2ChainId])
}
export function findCurrencyById(params: { id?: number; l2Id?: number }) {
  let currencies = store.getState()?.app.tokens
  const { id, l2Id } = params
  if (id) {
    return currencies.find((item) => item.id === id)
  }
  if (l2Id) {
    return currencies.find((item) => item.l2CurrencyId === l2Id)
  }
  return undefined
}
