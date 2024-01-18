import { isMainnet } from 'config'
import { L1ChainId } from 'types'

export const StarkNetChainId = '0x534e5f474f45524c49'

export enum MainnetChainIds {
  Ethereum = 1,
  Optimism = 10,
  BSC = 56,
  Polygon = 137,
  zkSyncEra = 324,
  PolygonZkEVM = 1101,
  Arbitrum = 42161,
  Avalanche = 43114,
  Linea = 59144,
  opBNB = 204,
  Scroll = 534352,
}

export enum TestnetChainIds {
  Goerli = 5,
  BSC = 97,
  zkSyncEra = 280,
  Optimism = 420,
  PolygonZkEVM = 1442,
  Avalanche = 43113,
  Linea = 59140,
  Polygon = 80001,
  ArbitrumGoerli = 421613,
  Scroll = 534353,
  opBNB = 5611,
}

/**
 * Use to initialize the web3-react connections.
 */
export const chainlist: Record<number, string> = isMainnet
  ? {
      [MainnetChainIds.Ethereum]: 'https://eth.llamarpc.com',
      [MainnetChainIds.Optimism]: 'https://mainnet.optimism.io',
      [MainnetChainIds.BSC]: 'https://bsc-dataseed.binance.org',
      [MainnetChainIds.Polygon]: 'https://polygon.llamarpc.com',
      [MainnetChainIds.zkSyncEra]: 'https://mainnet.era.zksync.io',
      [MainnetChainIds.Arbitrum]: 'https://arb1.arbitrum.io/rpc',
      [MainnetChainIds.Avalanche]: 'https://api.avax.network/ext/bc/C/rpc',
      [MainnetChainIds.PolygonZkEVM]: 'https://zkevm-rpc.com',
      [MainnetChainIds.Scroll]: 'https://rpc.scroll.io',
    }
  : {
      [TestnetChainIds.Goerli]: 'https://eth-goerli.public.blastapi.io',
      [TestnetChainIds.BSC]:
        'https://endpoints.omniatech.io/v1/bsc/testnet/public',
      [TestnetChainIds.zkSyncEra]: 'https://testnet.era.zksync.dev',
      [TestnetChainIds.Avalanche]: 'https://api.avax-test.network/ext/bc/C/rpc',
      [TestnetChainIds.Polygon]: 'https://matic-mumbai.chainstacklabs.com',
      [TestnetChainIds.Scroll]:
        'https://scroll-prealpha.blockpi.network/v1/rpc/public',
      [TestnetChainIds.Linea]: 'https://rpc.goerli.linea.build',
      [TestnetChainIds.ArbitrumGoerli]:
        'https://endpoints.omniatech.io/v1/arbitrum/goerli/public',
      [TestnetChainIds.Optimism]:
        'https://endpoints.omniatech.io/v1/op/goerli/public',
      [TestnetChainIds.PolygonZkEVM]: 'https://rpc.public.zkevm-test.net',
    }

// ---------- The polling interval to fetch the balances of layer one ----------
export const REQUEST_ETHEREUM_BALANCES_INTERVAL = 20000

// ---------- Networks sort by layerOneChainId ----------
export const NETWORKS_SELECTION_PRIORITY: L1ChainId[] = [
  MainnetChainIds.Ethereum,
  MainnetChainIds.zkSyncEra,
  MainnetChainIds.Linea,
  MainnetChainIds.PolygonZkEVM,
  MainnetChainIds.BSC,
  MainnetChainIds.Arbitrum,

  TestnetChainIds.Goerli,
  TestnetChainIds.zkSyncEra,
  TestnetChainIds.Linea,
  TestnetChainIds.Scroll,
  TestnetChainIds.PolygonZkEVM,
  TestnetChainIds.ArbitrumGoerli,
  TestnetChainIds.BSC,
]
