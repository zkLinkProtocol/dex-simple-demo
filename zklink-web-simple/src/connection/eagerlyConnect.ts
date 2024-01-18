import { Connector } from '@web3-react/types'
import { useSyncExternalStore } from 'react'

import { getConnection, gnosisSafeConnection } from './index'
import { getRecentConnectionMeta, setRecentConnectionMeta } from './meta'
import { ConnectionType } from './types'

class FailedToConnect extends Error {}

let connectionReady: Promise<void> | true = true

export function useConnectionReady() {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (connectionReady instanceof Promise) {
        connectionReady.finally(onStoreChange)
      }
      return () => undefined
    },
    () => connectionReady === true
  )
}

async function connect(connector: Connector, type: ConnectionType) {
  performance.mark(`web3:connect:${type}:start`)
  try {
    if (connector.connectEagerly) {
      await connector.connectEagerly()
    } else {
      await connector.activate()
    }
    return true
  } catch (error) {
    console.debug(`web3-react eager connection error: ${error}`)
    return false
  } finally {
    performance.measure(`web3:connect:${type}`, `web3:connect:${type}:start`)
  }
}

// The Safe connector will only work from safe.global, which iframes;
// it is only necessary to try (and to load all the deps) if we are in an iframe.
if (window !== window.parent) {
  connect(gnosisSafeConnection.connector, ConnectionType.GNOSIS_SAFE)
}

// Get the persisted wallet type from the last session.
const meta = getRecentConnectionMeta()
if (meta?.type && !meta.disconnected) {
  const selectedConnection = getConnection(meta.type)
  if (selectedConnection) {
    connectionReady = connect(selectedConnection.connector, meta.type)
      .then((connected) => {
        if (!connected) throw new FailedToConnect()
      })
      .catch((error) => {
        console.error(`Failed to connect to ${meta.type}`, error)
        // Clear the persisted wallet type if it failed to connect.
        setRecentConnectionMeta(undefined)

        // Log it if it threw an unknown error.
        if (!(error instanceof FailedToConnect)) {
          console.error(error)
        }
      })
      .finally(() => {
        connectionReady = true
      })
  }
}
