import axios from 'axios'
import { ZKLINK_BROKER_API_ENDPOINT } from 'config'
import { L1ChainId, TokenId, Wei } from '../../types'

export async function getBrokerPrice<
  T extends {
    code: number
    data: {
      available: Wei
      fee: number
      limit: Wei
    }
  }
>(chainId: L1ChainId, tokenId: TokenId) {
  const chainIdString = `0x${Number(chainId).toString(16)}`
  console.log(
    '🚀 ~ file: broker.ts:20 ~ ZKLINK_BROKER_API_ENDPOINT:',
    ZKLINK_BROKER_API_ENDPOINT
  )
  return await axios
    .get<T>(`/price/${chainIdString}/${tokenId}`, {
      baseURL: ZKLINK_BROKER_API_ENDPOINT,
    })
    .then((r) => r.data)
    .then((r) => r.data)
}
