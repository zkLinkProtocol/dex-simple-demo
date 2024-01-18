import { utils } from 'ethers'
import erc20Artifact from './IERC20.json'
import gatewayArtifact from './LineaL1Gateway.json'
import zklinkArtifact from './ZkLink.json'
import multicallArtifact from './multicall.json'

export const ZKLINK_MAIN_CONTRACT_INTERFACE = new utils.Interface(
  zklinkArtifact.abi
)

export const ZKLINK_GATEWAY_CONTRACT_INTERFACE = new utils.Interface(
  gatewayArtifact.abi
)

export const ERC20_INTERFACE = new utils.Interface(erc20Artifact.abi)

export const FAUCET_CONTRACT_ABI = ['function mint(address)']
export const FAUCET_CONTRACT_INTERFACE = new utils.Interface(
  FAUCET_CONTRACT_ABI
)

export { erc20Artifact, gatewayArtifact, multicallArtifact, zklinkArtifact }
