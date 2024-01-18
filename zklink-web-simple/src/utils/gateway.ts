import { utils } from 'ethers'
import gatewayArtifact from '../abi/LineaL1Gateway.json'

export const GATEWAY_CONTRACT_INTERFACE = new utils.Interface(
  gatewayArtifact.abi
)
