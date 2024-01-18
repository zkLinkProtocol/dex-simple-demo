import { getConnection } from 'connection'
import { ConnectionType } from 'connection/types'
import { useMemo } from 'react'
import { useCurrentConnectorName } from 'store/settings/hooks'

export default function useOrderedConnections() {
  const currentConnectorName = useCurrentConnectorName()
  return useMemo(() => {
    const orderedConnectionNames: ConnectionType[] = []

    if (currentConnectorName) {
      if (ConnectionType[currentConnectorName]) {
        orderedConnectionNames.push(currentConnectorName)
      }
    }
    // orderedConnectionNames.push(...ConnectionType.filter((name) => name !== currentConnectorName))

    return orderedConnectionNames.map(getConnection)
  }, [currentConnectorName])
}
