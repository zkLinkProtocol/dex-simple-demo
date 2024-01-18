import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core'
import { Connector } from '@web3-react/types'
import { connections } from 'connection'
import { ReactNode } from 'react'
import { Web3ProviderUpdater } from './Updater'

export default function Web3Provider({ children }: { children: ReactNode }) {
  const connectors = connections.map<[Connector, Web3ReactHooks]>(
    ({ hooks, connector }) => [connector, hooks]
  )

  return (
    <Web3ReactProvider connectors={connectors}>
      {children}
      <Web3ProviderUpdater />
    </Web3ReactProvider>
  )
}
