import {
  WalletConnect,
  WalletConnectConstructorArgs,
} from '@web3-react/walletconnect-v2'
import { WALLET_CONNECT_PROJECT_ID } from 'config'
import { chainlist } from 'config/chains'

export class WalletConnectV2 extends WalletConnect {
  ANALYTICS_EVENT = 'Wallet Connect QR Scan'
  constructor({
    actions,
    defaultChainId,
    qrcode = true,
    onError,
  }: Omit<WalletConnectConstructorArgs, 'options'> & {
    defaultChainId: number
    qrcode?: boolean
  }) {
    const darkmode = Boolean(window.matchMedia('(prefers-color-scheme: dark)'))
    super({
      actions,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID as string,
        chains: [defaultChainId],
        optionalChains: [...Object.keys(chainlist).map((v) => Number(v))],
        showQrModal: qrcode,
        rpcMap: chainlist,
        // as of 6/16/2023 there are no docs for `optionalMethods`
        // this set of optional methods fixes a bug we encountered where permit2 signatures were never received from the connected wallet
        // source: https://uniswapteam.slack.com/archives/C03R5G8T8BH/p1686858618164089?thread_ts=1686778867.145689&cid=C03R5G8T8BH
        optionalMethods: [
          'eth_signTypedData',
          'eth_signTypedData_v4',
          'eth_sign',
        ],
        qrModalOptions: {
          desktopWallets: undefined,
          enableExplorer: true,
          explorerExcludedWalletIds: undefined,
          explorerRecommendedWalletIds: undefined,
          mobileWallets: undefined,
          privacyPolicyUrl: undefined,
          termsOfServiceUrl: undefined,
          themeMode: darkmode ? 'dark' : 'light',
          themeVariables: {
            '--wcm-font-family': '"Inter custom", sans-serif',
            '--wcm-z-index': '100000',
          },
          walletImages: undefined,
        },
      },
      onError,
    })
  }

  activate(chainId?: number) {
    return super.activate(chainId)
  }
}
