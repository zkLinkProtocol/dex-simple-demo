import { Connector } from '@web3-react/types'
import {
  getConnection,
  gnosisSafeConnection,
  networkConnection,
} from 'connection'
import { useEffect } from 'react'
import { useAppDispatch } from 'store'
import { useCurrentConnectorName } from 'store/settings/hooks'

async function connect(connector: Connector) {
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
  }
}

export default function useEagerlyConnect() {
  const dispatch = useAppDispatch()
  const selectedWallet = useCurrentConnectorName()
  // const rehydrated = useStateRehydrated()

  useEffect(() => {
    try {
      connect(gnosisSafeConnection.connector)
      connect(networkConnection.connector)

      if (!selectedWallet) return
      const selectedConnection = getConnection(selectedWallet)

      if (selectedConnection) {
        connect(selectedConnection.connector)
      }
    } catch {
      // only clear the persisted wallet type if it failed to connect.
      // if (rehydrated) {
      //   dispatch(updateSelectedWallet({ wallet: undefined }))
      // }
      return
    }
  }, [
    dispatch,
    // , rehydrated
    selectedWallet,
  ])
}
