import { isAddress } from 'ethers/lib/utils'
import { findNetworks } from 'store/app/hooks'
import { L1ChainId, L2ChainId } from 'types'
import { ZKLINK_SCAN_ENDPOINT } from '../config'

export function viewOnZKLinkExplorer(hash: string) {
  if (!hash) return
  window.open(zklinkExplorerUrl(hash), '_blank')
}

export function zklinkExplorerUrl(hash: string) {
  if (isAddress(hash)) {
    return ZKLINK_SCAN_ENDPOINT + '/address/' + hash
  } else {
    return ZKLINK_SCAN_ENDPOINT + '/tx/' + hash
  }
}

export function getExplorerUrl(
  params: {
    layerOneChainId?: L1ChainId
    layerTwoChainId?: L2ChainId
  },
  hash: string
) {
  if (!hash) return
  const network = findNetworks(params)
  if (!network) return
  if (isAddress(hash)) {
    return network.explorerUrl + '/address/' + hash
  } else {
    return network.explorerUrl + '/tx/' + hash
  }
}

export function viewOnExplorer(
  params: {
    layerOneChainId?: L1ChainId
    layerTwoChainId?: L2ChainId
  },
  hash: string
) {
  const url = getExplorerUrl(params, hash)
  if (!url) return
  window.open(url, '_blank')
}
