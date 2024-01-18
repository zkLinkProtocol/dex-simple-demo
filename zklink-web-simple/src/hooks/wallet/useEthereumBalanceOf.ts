import { Interface } from '@ethersproject/abi'
import { isAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { Web3Provider } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import MulticallAbi from 'abi/multicall.json'
import { REQUEST_ETHEREUM_BALANCES_INTERVAL } from 'config/chains'
import { providers } from 'ethers'
import { union } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { store } from 'store'
import { updateActionState } from 'store/app/actions'
import {
  findNetworks,
  useAddress,
  useContracts,
  useGateways,
  useSpotCurrencies,
  useSupportChains,
} from 'store/app/hooks'
import { StaticContracts } from 'store/app/types'
import { updateEthereumBalances } from 'store/link/actions'
import { EthereumBalances } from 'store/link/types'
import { Address, L1ChainId, Wei } from 'types'
import { AddressGas, isGasAddress, isZeroAddress } from 'utils/address'
import { timer } from 'utils/timer'

const multicallContracts: {
  [x: string]: Contract
} = {}
export const getMulticallContract = function (
  contractAddress: Address,
  provider: Web3Provider
) {
  if (multicallContracts[contractAddress]) {
    return multicallContracts[contractAddress]
  } else {
    const contract = new Contract(contractAddress, MulticallAbi, provider)
    multicallContracts[contractAddress] = contract
    return contract
  }
}
export const sendMulticall = async (
  provider: Web3Provider,
  contractAddress: Address,
  abi: any[],
  functionName: string,
  callAddresses: Address[],
  calls: any[]
) => {
  try {
    const iface = new Interface(abi)
    const fragment = iface.getFunction(functionName)
    const contract = getMulticallContract(contractAddress, provider)
    const tx = await contract.multiStaticCall(callAddresses, calls)

    // const multicallInterface = new Interface(MulticallAbi)
    // const fragment2 = multicallInterface.getFunction('multiStaticCall')
    // const calldata = multicallInterface.encodeFunctionData(fragment2, [callAddresses, calls])
    // const tx = await provider.call({
    //   to: contractAddress,
    //   data: calldata
    // })
    const [blockNumber, returnDatas] = tx
    return returnDatas.map(
      (
        data: {
          success: boolean
          returnData: string
        },
        index: number
      ) => {
        const decodeData = iface.decodeFunctionResult(fragment, data.returnData)
        return decodeData[0]
      }
    )
  } catch (e) {
    return []
  }
}

export function useFetchEthereumBalance(l1ChainId: L1ChainId) {
  const address = useAddress()
  const supportChains = useSupportChains()
  const currencies = useSpotCurrencies()
  const gateways = useGateways()

  const tokenAddresses = useMemo(() => {
    const chain = supportChains.find(
      (chain) => chain.layerOneChainId === l1ChainId
    )
    if (!chain) {
      return []
    }

    // if (chain.gateway) {
    //   return union(
    //     ...gateways.map((gateway) =>
    //       gateway.tokens.map((token) => token.tokenAddress)
    //     )
    //   )
    // } else {
    return union(
      currencies.map((v) => {
        if (v.chains && v.chains[chain.layerTwoChainId]) {
          return v.chains[chain.layerTwoChainId].address
        } else {
          return ''
        }
      })
    )
    // }
  }, [supportChains, gateways, l1ChainId])

  useFetchEthereumBalanceByAddresses(l1ChainId, address, tokenAddresses)
}

function fetchEthereumBalance({
  layerOneChainId,
  contracts,
  provider,
  accountAddress,
  tokenAddresses,
}: {
  layerOneChainId: L1ChainId
  contracts: StaticContracts
  provider: providers.JsonRpcProvider
  accountAddress: Address
  tokenAddresses: Address[]
}) {
  return async function () {
    const { multicall } = contracts

    const contractAddress = multicall[layerOneChainId]

    if (!contractAddress) {
      return
    }
    if (!provider) {
      return
    }
    const balanceOfAbi = ['function balanceOf(address) view returns (uint256)']
    const hasGasToken = tokenAddresses.filter((v) => isGasAddress(v))

    const erc20Addresses = tokenAddresses.filter(
      (address) =>
        isAddress(address) && !isGasAddress(address) && !isZeroAddress(address)
    )
    let balances: Wei[] = []
    store.dispatch(
      updateActionState({
        action: 'ethereumBalancesPulling',
        state: true,
      })
    )

    if (erc20Addresses.length) {
      try {
        const iface = new Interface(balanceOfAbi)
        const fragment = iface.getFunction('balanceOf')
        const calldata = iface.encodeFunctionData(fragment, [accountAddress])
        const calls = erc20Addresses.map(() => calldata)
        const resultData = await sendMulticall(
          provider as Web3Provider,
          contractAddress,
          balanceOfAbi,
          'balanceOf',
          erc20Addresses,
          calls
        )
        balances = resultData.map((r: BigNumber) => r.toString())
      } catch (e) {
        console.error(e)
      }
    }

    const update: EthereumBalances = {
      [layerOneChainId]: {},
    }

    if (hasGasToken) {
      update[layerOneChainId][AddressGas.toLowerCase()] = (
        await provider.getBalance(accountAddress)
      ).toString()
    }
    erc20Addresses.forEach((v, i) => {
      update[layerOneChainId][v] = balances[i]
    })

    store.dispatch(
      updateEthereumBalances({
        ethereumBalances: update,
      })
    )
    store.dispatch(
      updateActionState({
        action: 'ethereumBalancesPulling',
        state: false,
      })
    )
  }
}

export function useFetchEthereumBalanceByAddresses(
  l1ChainId: L1ChainId,
  accountAddress: Address,
  tokenAddresses: Address[]
) {
  const dispatch = useDispatch()
  const contracts = useContracts()
  const { provider } = useWeb3React()

  useEffect(() => {
    const { layerOneChainId = 0, layerTwoChainId = 0 } =
      findNetworks({ layerOneChainId: l1ChainId }) ?? {}

    if (
      layerOneChainId === undefined ||
      !contracts ||
      !tokenAddresses?.length ||
      !accountAddress ||
      isZeroAddress(accountAddress)
    ) {
      return
    }

    return timer(
      fetchEthereumBalance({
        layerOneChainId,
        contracts,
        provider: provider!,
        accountAddress,
        tokenAddresses,
      }),
      REQUEST_ETHEREUM_BALANCES_INTERVAL
    )
  }, [contracts, l1ChainId, provider, tokenAddresses, accountAddress])
}
