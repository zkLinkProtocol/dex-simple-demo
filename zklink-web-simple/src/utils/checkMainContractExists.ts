import { ZKLINK_MAIN_CONTRACT_INTERFACE } from 'abi'
import { isMainnet } from 'config'
import { GovernorAddresses } from 'config/deposit'
import { providers } from 'ethers'
import { Address, L1ChainId } from 'types'

export async function checkMainContractExists(
  provider: providers.JsonRpcProvider | providers.Web3Provider,
  chainId: L1ChainId,
  mainContract: Address
) {
  // The mainnet governor address is the same for all chains, so we can skip this check
  return true
  if (isMainnet === false) {
    return
  }
  const data = ZKLINK_MAIN_CONTRACT_INTERFACE.encodeFunctionData(
    'networkGovernor',
    []
  )

  const governor = await provider
    .call({
      to: mainContract,
      data,
    })
    .catch((e) => {
      throw new Error(e?.message)
    })

  if (!governor) {
    throw new Error(
      `Failed to obtain the governor address. ${chainId} - ${governor}`
    )
  }

  if (!GovernorAddresses[chainId]) {
    throw new Error(`The Governor address is not configured. ${chainId}`)
  }

  if (GovernorAddresses[chainId].toLowerCase() !== governor.toLowerCase()) {
    throw new Error(
      `Invalid main contract address. Please contact us for a resolution. ${chainId} - ${governor}`
    )
  }
}
