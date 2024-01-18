import {
  TransactionReceipt,
  getTransactionByHash,
} from 'api/v3/getTransactionByHash'
import { sleep } from './sleep'

export async function watchTransaction(
  txHash: string
): Promise<TransactionReceipt> {
  while (true) {
    const response = await getTransactionByHash(txHash).catch((e) => {
      console.error(e)
      return null
    })
    if (response && response.result) {
      if (response.result.receipt.executed) {
        return response.result
      }
    }

    await sleep(2000)
  }
}
