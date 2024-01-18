import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  ChainInfo,
  getChangePubkeyChainId,
  getStaticNetworksProfile,
  getSupportChains,
} from 'api/v3/chains'
import { EthProperty, getEthProperty } from 'api/v3/ethProperty'
import { Currency, getSupportTokens } from 'api/v3/tokens'
import { ZKLINK_STATIC_ENDPOINT } from 'config'
import { NETWORKS_SELECTION_PRIORITY, StarkNetChainId } from 'config/chains'
import { L1ChainId, L2ChainId } from 'types'
import { sortNetworksByLayerTwoChainId } from 'utils/networks'
import { ActionState, ModalState, StaticContracts } from './types'

export const updateCurrentNetwork = createAction<L1ChainId>(
  'app/updateCurrentNetwork'
)
export const updateStaticContracts = createAction<{
  contracts: StaticContracts
}>('app/updateStaticContracts')
export const updateActionState = createAction<{
  action: keyof ActionState
  state: boolean
}>('app/updateActionState')
export const updateModal = createAction<{
  modal: keyof ModalState
  open: boolean
}>('app/updateModal')
export const cleanModal = createAction<{}>('app/cleanModal')

export const updateOpenRenderFlag = createAction<{ flag: number }>(
  'app/updateOpenRenderFlag'
)
export const updateFaucetQueueLen = createAction<number>(
  'app/updateFaucetQueueLen'
)

export const getChainsActions = createAsyncThunk<{
  chains: ChainInfo[]
  changePubKeyChainId: L2ChainId
  ethProperty: EthProperty
}>('app/getChainsActions', async () => {
  const { result: chains } = await getSupportChains()
  const { result: ethProperty } = await getEthProperty()
  const { result: changePubkeyChainId } = await getChangePubkeyChainId()

  // Convert eth gateway chain id from hex string to integer
  ethProperty.layerOneChainId = Number(ethProperty.layerOneChainId)

  // Get all EVM chains and convert layerOneChainId to integer(e.g. layerOneChainId: "0x01" -> 1).
  let evmChains = chains
    .filter((v) => v.layerOneChainId !== StarkNetChainId)
    .map((v) => ({
      ...v,
      layerOneChainId: Number(v.layerOneChainId),
      decimals: 0,
    }))

  for (let i in evmChains) {
    evmChains[i].gateway = false
    // Copy a field named 'layerTwoChainId' for clarity on chain ID information during development.
    evmChains[i].layerTwoChainId = evmChains[i].chainId

    // During development, it is advisable to avoid using the 'chainId' field.
    // We recommend using 'layerOneChainId' and 'layerTwoChainId' as they have clear and distinct responsibilities.
    // The 'chainId' field will be removed from the object at some point.
    evmChains[i].chainId = evmChains[i].layerOneChainId
  }

  // Add the gateway chains to supported chain list
  evmChains.push({
    // Add some zklink keys
    layerOneChainId: Number(ethProperty.layerOneChainId),
    layerTwoChainId: ethProperty.chainId,
    chainId: ethProperty.chainId,
    mainContract: '',
    layerZeroContract: '',
    gasTokenId: ethProperty.gasTokenId,
    depositConfirmation: ethProperty.depositConfirmation,
    decimals: 18,

    isSupport: true,
    id: 0,
    updateTime: 0,

    // Chains marked for communication only through a gateway
    gateway: true,
  })

  try {
    const networks = await getStaticNetworksProfile().catch((e) => {
      throw new Error('getStaticNetworksProfile fail: ' + e?.message)
    })

    if (networks?.length) {
      evmChains = evmChains.map((d) => {
        const net = networks.find(
          (n) => Number(n.chainId) === d.layerOneChainId
        )
        if (!net) {
          return d
        }
        const additional = {
          name: net.name,
          symbol: net.symbol,
          explorerUrl: net.explorerUrl,
          iconUrl: ZKLINK_STATIC_ENDPOINT + net.iconUrl,
          rpcUrl: net.rpcUrl,
          decimals: net.decimals,
          isSupport: true,
        }

        return {
          ...d,
          ...additional,
        }
      })
    } else {
      console.error('getStaticNetworksProfile fail: networks undefined')
    }
  } catch (e) {}

  return {
    chains: sortNetworksByLayerTwoChainId(
      evmChains,
      NETWORKS_SELECTION_PRIORITY
    ),
    changePubKeyChainId: changePubkeyChainId,
    // Convert the chain id from hex string to integer
    ethProperty,
  }
})

export const getTokensActions = createAsyncThunk<Currency[]>(
  'app/getTokensActions',
  async () => {
    const { result } = await getSupportTokens()
    const tokens: Currency[] = (Object.values(result) as any[]).map((v) => {
      return {
        ...v,
        name: v.symbol,
        main: true,
        conversionRatio: 0,
        displayName: v.symbol,
        createdAt: 0,
        tokenIconUrl: `${ZKLINK_STATIC_ENDPOINT}/token/icons/default/${v.symbol.toLowerCase()}.svg`,
        l2CurrencyId: v.id,
        l2Symbol: v.symbol,
      } as Currency
    })

    return tokens
  }
)
