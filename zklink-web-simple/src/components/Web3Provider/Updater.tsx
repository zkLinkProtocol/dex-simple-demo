import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { memo, useEffect } from 'react'
import { useAppDispatch } from '../../store'
import { updateCurrentNetwork } from '../../store/app/actions'
import { changeAccount } from '../../store/app/hooks'
import { Address } from '../../types'

export const Web3ProviderUpdater = memo(() => {
  const { provider, account, chainId, isActive } = useWeb3React<Web3Provider>()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (isActive && chainId) {
      dispatch(updateCurrentNetwork(chainId))
    }
  }, [isActive, chainId])

  // Listen for changes to the connection
  useEffect(() => {
    if (!provider || !provider.provider) {
      return
    }
    // @ts-ignore
    if (!provider.provider.on) {
      console.error('provider.on is undefined')
      return
    }

    // disconnect when changed account.
    const handleAccountsChanged = (accounts: Address[]) => {
      console.debug('accountsChanged', accounts, account)
      if (accounts[0] !== account) {
        changeAccount()
      }
    }

    // @ts-ignore
    provider.provider.on('accountsChanged', handleAccountsChanged)

    return () => {
      // @ts-ignore
      provider.provider.off('accountsChanged', handleAccountsChanged)
    }
  }, [provider, account])

  return null
})
