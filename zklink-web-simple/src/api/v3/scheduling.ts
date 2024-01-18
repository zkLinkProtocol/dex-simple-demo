import { GatewayInfo } from './ethProperty'

// This is an abstruct interface, waiting for zklink to implement the actual scheduling system interface.
export async function getGatewayScheduling(gateways: GatewayInfo[]) {
  return gateways[0]
}
