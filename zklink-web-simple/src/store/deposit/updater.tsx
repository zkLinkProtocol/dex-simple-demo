import { getDepositSearch } from 'api/v3/explorer'
import { DefaultDepositConfirmations } from 'config/deposit'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { store } from 'store'
import { findNetworks } from 'store/app/hooks'
import { useDepositEthHash } from 'store/history/hooks'
import { L1ChainId } from 'types'
import { useInterval } from 'usehooks-ts'
import {
  updateDepositStatus,
  updateEthHash,
  updateQueryL2Hash,
  updateTxConfirmations,
} from './actions'
import { useQueryL2Hash, useUnexpiredDepositTransactions } from './hook'
import { DepositStatus, EthHashItem } from './types'

function getDepositConfirmations(chainId: L1ChainId) {
  const network = findNetworks({
    layerOneChainId: chainId,
  })
  if (!network) {
    console.error('Cannot find valid network data', chainId)
    return DefaultDepositConfirmations
  }

  return network?.depositConfirmation ?? DefaultDepositConfirmations
}

async function getDepositBatchResultFromLayer1(ethHashItem: EthHashItem) {
  if (!ethHashItem?.hash) {
    console.error('Missing or invalid deposit hash', ethHashItem.hash)
    return
  }
  if (!ethHashItem?.chainId) {
    console.error('Missing or invalid deposit chainId', ethHashItem.chainId)
    return
  }

  const network = findNetworks({
    layerOneChainId: ethHashItem.chainId,
  })
  if (!network) {
    console.error('Cannot find valid network data', JSON.stringify(ethHashItem))
    return
  }

  const provider = new ethers.providers.JsonRpcProvider(network.rpcUrl)
  return provider?.getTransactionReceipt(ethHashItem.hash).catch((e) => {
    console.error(e)
  })
}
async function getDepositSearchByEthHash(ethHash: string) {
  return await getDepositSearch(ethHash)
}

async function checkBlockConfirmations(depositEthHash: EthHashItem[]) {
  if (!depositEthHash.length) return

  let queryL2Hash: string[] = []
  Promise.all(
    depositEthHash.map((x) => getDepositBatchResultFromLayer1(x))
  ).then((res) => {
    res?.forEach((receipt, index) => {
      const { status, confirmations = 0, transactionHash = '' } = receipt ?? {}
      console.log('Transaction confirmations:', confirmations, transactionHash)

      // blockchain executed status: 1 success, 0 failed
      if (status === 1) {
        if (
          confirmations >=
          getDepositConfirmations(depositEthHash[index].chainId)
        ) {
          store.dispatch(
            updateDepositStatus([
              {
                ethHash: transactionHash,
                status: DepositStatus.BlockConfirmed,
              },
            ])
          )

          store.dispatch(
            updateTxConfirmations([
              {
                txHash: transactionHash,
                confirmations: getDepositConfirmations(
                  depositEthHash[index].chainId
                ),
              },
            ])
          )
          queryL2Hash.push(transactionHash)
        } else {
          store.dispatch(
            updateDepositStatus([
              {
                ethHash: transactionHash,
                status: DepositStatus.BlockConfirmations,
              },
            ])
          )
          store.dispatch(
            updateTxConfirmations([{ txHash: transactionHash, confirmations }])
          )
        }
      } else if (status === 0) {
        store.dispatch(
          updateDepositStatus([
            {
              ethHash: transactionHash,
              status: DepositStatus.BlockFailed,
            },
          ])
        )
      } else {
        store.dispatch(
          updateDepositStatus([
            {
              ethHash: transactionHash,
              status: DepositStatus.BlockPending,
            },
          ])
        )
      }
    })
    store.dispatch(updateQueryL2Hash(queryL2Hash))
  })
}

function checkZklinkStatus(queryL2Hash: string[]) {
  Promise.all(queryL2Hash.map((m) => getDepositSearchByEthHash(m))).then(
    (res) => {
      res?.forEach((n, i) => {
        if (n?.data?.result?.detail) {
          store.dispatch(
            updateDepositStatus([
              {
                ethHash: queryL2Hash[i],
                status: DepositStatus.ZkLinkConfirmed,
              },
            ])
          )
        }
      })
    }
  )
}

function useWatchDepositList() {
  const dispatch = useDispatch()
  const pendingTxs = useUnexpiredDepositTransactions()
  const depositEthHash = useDepositEthHash()
  const queryL2Hash = useQueryL2Hash()

  useEffect(() => {
    if (!pendingTxs.length) return

    let ethHashList: EthHashItem[] = []
    pendingTxs.forEach((item) => {
      const depositStatus = store.getState()?.deposit?.depositStatus
      if (!depositStatus[item.ethHash]) {
        dispatch(
          updateDepositStatus([
            {
              ethHash: item.ethHash,
              status: DepositStatus.Loading,
            },
          ])
        )
      }
      if (depositStatus[item.ethHash] >= DepositStatus.BlockConfirmed) return
      ethHashList.push({
        hash: item.ethHash,
        chainId: item.layerOneChainId,
      })
    })
    dispatch(updateEthHash(ethHashList))
  }, [pendingTxs])
  useEffect(() => {
    if (!depositEthHash.length) return
    checkBlockConfirmations(depositEthHash)
  }, [depositEthHash])
  useInterval(
    () => {
      checkBlockConfirmations(depositEthHash)
    },
    depositEthHash?.length ? 1000 * 10 : null
  )
  useEffect(() => {
    if (!queryL2Hash.length) return

    checkZklinkStatus(queryL2Hash)
  }, [queryL2Hash])

  useInterval(
    () => {
      checkZklinkStatus(queryL2Hash)
    },
    queryL2Hash?.length ? 1000 * 10 : null
  )
}

export default function Updater() {
  useWatchDepositList()

  return null
}
