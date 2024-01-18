import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { GnosisSafe } from '@web3-react/gnosis-safe'
import { MetaMask } from '@web3-react/metamask'
import { Network } from '@web3-react/network'
import { Actions, Connector } from '@web3-react/types'
import ZKLINK_LOGO from 'assets/logo/zklink.svg'
import BITGET_ICON from 'assets/wallets/bitget-icon.png'
import COINBASE_ICON from 'assets/wallets/coinbase.svg'
import GNOSIS_ICON from 'assets/wallets/gnosis.png'
import OKX_ICON from 'assets/wallets/okx-icon.png'
import WALLET_CONNECT_ICON from 'assets/wallets/walletconnect.svg'
import { chainlist } from 'config/chains'
import {
  BITGET_DOWNLOAD_PAGE,
  COINBASE_DOWNLOAD_PAGE,
  METAMASK_HOMEPAGE,
  OKX_DOWNLOAD_PAGE,
} from 'config/community'
import { providers } from 'ethers'
import { useSyncExternalStore } from 'react'
import { L1ChainId } from 'types'
import { isMobile } from 'utils/userAgent'
import { WalletConnectV2 } from './WalletConnectV2'
import { Connection, ConnectionType } from './types'
import {
  getInjection,
  getIsBitgetWallet,
  getIsCoinbaseWallet,
  getIsInjected,
  getIsMetaMaskWallet,
  getIsOkxWallet,
} from './utils'
import { Bitget } from './wallets/bitget'
import { Okx } from './wallets/okx'

function onError(error: Error) {
  console.debug(`web3-react error: ${error}`)
}

const rpcProviders: Record<L1ChainId, providers.JsonRpcProvider> =
  Object.entries(chainlist).reduce<
    Record<L1ChainId, providers.JsonRpcProvider>
  >((previous, current) => {
    previous[Number(current[0])] = new providers.JsonRpcProvider(current[1], {
      name: String(current[0]),
      chainId: Number(current[0]),
    })
    return previous
  }, {})
console.log('🚀 ~ file: index.ts:42 ~ rpcProviders:', rpcProviders)

const [web3Network, web3NetworkHooks] = initializeConnector<Network>(
  (actions) => new Network({ actions, urlMap: rpcProviders, defaultChainId: 1 })
)
export const networkConnection: Connection = {
  getName: () => 'Network',
  connector: web3Network,
  hooks: web3NetworkHooks,
  type: ConnectionType.NETWORK,
  shouldDisplay: () => false,
}

const getIsCoinbaseWalletBrowser = () => isMobile && getIsCoinbaseWallet()
const getIsMetaMaskBrowser = () => isMobile && getIsMetaMaskWallet()
const getIsInjectedMobileBrowser = () =>
  getIsCoinbaseWalletBrowser() || getIsMetaMaskBrowser()

const getShouldAdvertiseMetaMask = () =>
  !getIsMetaMaskWallet() &&
  !isMobile &&
  (!getIsInjected() || getIsCoinbaseWallet())
const getIsGenericInjector = () =>
  getIsInjected() && !getIsMetaMaskWallet() && !getIsCoinbaseWallet()

const [web3Injected, web3InjectedHooks] = initializeConnector<MetaMask>(
  (actions) => new MetaMask({ actions, onError })
)

export const injectedConnection: Connection = {
  getName: () => getInjection().name,
  connector: web3Injected,
  hooks: web3InjectedHooks,
  type: ConnectionType.INJECTED,
  getIcon: (isDarkMode: boolean) => getInjection(isDarkMode).icon,
  shouldDisplay: () =>
    getIsMetaMaskWallet() ||
    getShouldAdvertiseMetaMask() ||
    getIsGenericInjector(),
  // If on non-injected, non-mobile browser, prompt user to install Metamask
  overrideActivate: () => {
    if (getShouldAdvertiseMetaMask()) {
      window.open(METAMASK_HOMEPAGE, 'inst_metamask')
      return true
    }
    return false
  },
}

const [web3Bitget, web3BitgetHooks] = initializeConnector<Bitget>(
  (actions) =>
    new Bitget({
      actions,
      onError,
    })
)

export const bitgetConnection: Connection = {
  getName: () => 'Bitget Wallet',
  connector: web3Bitget,
  hooks: web3BitgetHooks,
  type: ConnectionType.BITGET,
  getIcon: () => BITGET_ICON,
  shouldDisplay: () => true,
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (!getIsBitgetWallet()) {
      window.open(BITGET_DOWNLOAD_PAGE, '_blank')
      return true
    }
    return false
  },
}

const [web3Okx, web3OkxHooks] = initializeConnector<Okx>(
  (actions) =>
    new Okx({
      actions,
      onError,
    })
)

export const okxConnection: Connection = {
  getName: () => 'OKX Wallet',
  connector: web3Okx,
  hooks: web3OkxHooks,
  type: ConnectionType.OKX,
  getIcon: () => OKX_ICON,
  shouldDisplay: () => true,
  overrideActivate: () => {
    if (!getIsOkxWallet()) {
      window.open(OKX_DOWNLOAD_PAGE, '_blank')
      return true
    }
    return false
  },
}

const [web3GnosisSafe, web3GnosisSafeHooks] = initializeConnector<GnosisSafe>(
  (actions) => new GnosisSafe({ actions })
)
export const gnosisSafeConnection: Connection = {
  getName: () => 'Gnosis Safe',
  connector: web3GnosisSafe,
  hooks: web3GnosisSafeHooks,
  type: ConnectionType.GNOSIS_SAFE,
  getIcon: () => GNOSIS_ICON,
  shouldDisplay: () => false,
}

export const walletConnectV2Connection: Connection = new (class
  implements Connection
{
  private initializer = (
    actions: Actions,
    defaultChainId = Number(Object.keys(chainlist)[0])
  ) => new WalletConnectV2({ actions, defaultChainId, onError })

  type = ConnectionType.WALLET_CONNECT_V2
  getName = () => 'WalletConnect'
  getIcon = () => WALLET_CONNECT_ICON
  shouldDisplay = () => !getIsInjectedMobileBrowser()

  private activeConnector = initializeConnector<WalletConnectV2>(
    this.initializer
  )
  // The web3-react Provider requires referentially stable connectors, so we use proxies to allow lazy connections
  // whilst maintaining referential equality.
  private proxyConnector = new Proxy(
    {},
    {
      get: (target, p, receiver) =>
        Reflect.get(this.activeConnector[0], p, receiver),
      getOwnPropertyDescriptor: (target, p) =>
        Reflect.getOwnPropertyDescriptor(this.activeConnector[0], p),
      getPrototypeOf: () => WalletConnectV2.prototype,
      set: (target, p, receiver) =>
        Reflect.set(this.activeConnector[0], p, receiver),
    }
  ) as typeof this.activeConnector[0]
  private proxyHooks = new Proxy(
    {},
    {
      get: (target, p, receiver) => {
        return () => {
          // Because our connectors are referentially stable (through proxying), we need a way to trigger React renders
          // from outside of the React lifecycle when our connector is re-initialized. This is done via 'change' events
          // with `useSyncExternalStore`:
          const hooks = useSyncExternalStore(
            (onChange) => {
              this.onActivate = onChange
              return () => (this.onActivate = undefined)
            },
            () => this.activeConnector[1]
          )
          return Reflect.get(hooks, p, receiver)()
        }
      },
    }
  ) as typeof this.activeConnector[1]

  private onActivate?: () => void

  overrideActivate = (chainId?: L1ChainId) => {
    // Always re-create the connector, so that the chainId is updated.
    this.activeConnector = initializeConnector((actions) =>
      this.initializer(actions, chainId)
    )
    this.onActivate?.()
    return false
  }

  get connector() {
    return this.proxyConnector
  }
  get hooks() {
    return this.proxyHooks
  }
})()

const [web3CoinbaseWallet, web3CoinbaseWalletHooks] =
  initializeConnector<CoinbaseWallet>(
    (actions) =>
      new CoinbaseWallet({
        actions,
        options: {
          url: Object.values(chainlist)[0],
          appName: 'zkLink',
          appLogoUrl: ZKLINK_LOGO,
          reloadOnDisconnect: false,
        },
        onError,
      })
  )
const coinbaseWalletConnection: Connection = {
  getName: () => 'Coinbase Wallet',
  connector: web3CoinbaseWallet,
  hooks: web3CoinbaseWalletHooks,
  type: ConnectionType.COINBASE_WALLET,
  getIcon: () => COINBASE_ICON,
  shouldDisplay: () =>
    Boolean(
      (isMobile && !getIsInjectedMobileBrowser()) ||
        !isMobile ||
        getIsCoinbaseWalletBrowser()
    ),
  // If on a mobile browser that isn't the coinbase wallet browser, deeplink to the coinbase wallet app
  overrideActivate: () => {
    if (isMobile && !getIsInjectedMobileBrowser()) {
      window.open(COINBASE_DOWNLOAD_PAGE, 'cbwallet')
      return true
    }
    return false
  },
}

export const connections = [
  gnosisSafeConnection,
  injectedConnection,
  okxConnection,
  bitgetConnection,
  walletConnectV2Connection,
  // coinbaseWalletConnection,
  networkConnection,
]

export function getConnection(c: Connector | ConnectionType) {
  if (c instanceof Connector) {
    const connection = connections.find(
      (connection) => connection.connector === c
    )
    if (!connection) {
      throw Error('unsupported connector')
    }
    return connection
  } else {
    switch (c) {
      case ConnectionType.INJECTED:
        return injectedConnection
      case ConnectionType.BITGET:
        return bitgetConnection
      case ConnectionType.OKX:
        return okxConnection
      case ConnectionType.COINBASE_WALLET:
        return coinbaseWalletConnection
      case ConnectionType.WALLET_CONNECT_V2:
        return walletConnectV2Connection
      case ConnectionType.NETWORK:
        return networkConnection
      case ConnectionType.GNOSIS_SAFE:
        return gnosisSafeConnection
    }
  }
}
