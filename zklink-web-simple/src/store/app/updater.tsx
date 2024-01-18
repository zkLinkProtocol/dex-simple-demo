import { getStaticMulticallContracts } from 'api/v1/statics'
import { useAppDispatch } from 'store'
import { useEffectOnce, useInterval } from 'usehooks-ts'
import {
  getChainsActions,
  getTokensActions,
  updateStaticContracts,
} from './actions'

export default function Updater(): null {
  const dispatch = useAppDispatch()

  useEffectOnce(() => {
    dispatch(getChainsActions())
    dispatch(getTokensActions())
  })

  useInterval(() => {
    dispatch(getTokensActions())
  }, 30000)

  // fetch multicall contract addresses, use to merge token balances requests.
  useEffectOnce(() => {
    getStaticMulticallContracts().then((r) => {
      if (r?.multicall) {
        const multicall: Record<number, string> = {},
          faucet: Record<number, string> = {}
        Object.keys(r.multicall).forEach(
          (k) => (multicall[Number(k)] = r.multicall[k as any])
        )
        Object.keys(r.faucet).forEach(
          (k) => (faucet[Number(k)] = r.faucet[k as any])
        )

        dispatch(
          updateStaticContracts({
            contracts: {
              multicall,
              faucet,
            },
          })
        )
      }
    })
  })

  return null
}
