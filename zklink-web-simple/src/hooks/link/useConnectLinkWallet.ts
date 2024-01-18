import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { connectLinkWallet, useLinkStatus } from 'store/link/hooks'
import { LinkStatus } from 'store/link/types'

const useConnectLinkWallet = () => {
  const linkStatus = useLinkStatus()
  const { provider } = useWeb3React<Web3Provider>()
  return useCallback(async () => {
    try {
      if (linkStatus === LinkStatus.linkL2Pending) {
        return
      }
      if (!provider) {
        return
      }

      await connectLinkWallet(provider)
    } catch (e) {}
  }, [LinkStatus, provider])
}

export default useConnectLinkWallet
