import axios from 'axios'
import { Address, L1ChainId } from 'types'
import { ZKLINK_STATIC_ENDPOINT } from '../../config'

export async function getStaticMulticallContracts<
  T extends {
    multicall: Record<L1ChainId, Address>
    faucet: Record<L1ChainId, Address>
  }
>(): Promise<T> {
  const r = await axios.get(ZKLINK_STATIC_ENDPOINT + '/contracts/main.json')
  return r.data
}
