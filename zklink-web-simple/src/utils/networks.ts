import { ChainInfo } from 'api/v3/chains'
import { L1ChainId } from 'types'

export function sortNetworksByLayerTwoChainId(
  networks: ChainInfo[],
  priority: L1ChainId[]
) {
  let res: ChainInfo[] = []
  priority.forEach((x, index) => {
    const network = networks.find((y) => y.layerOneChainId === x)
    const networkIndex = networks.findIndex((y) => y.layerOneChainId === x)
    if (network && networkIndex) {
      res.push(network)
      networks.splice(networkIndex, 1)
    }
  })
  return [...res, ...networks]
}
