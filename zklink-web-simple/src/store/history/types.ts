import { ApiHistoryItem } from 'api/v1/txHistory'
import { HistoryTabType } from 'views/History/Tab'

export interface HistoryState {
  historyTab: HistoryTabType
  deposit: {
    total: number
    list: ApiHistoryItem[]
  }
  withdraw: {
    total: number
    list: ApiHistoryItem[]
  }
  transfer: {
    total: number
    list: ApiHistoryItem[]
  }
}
