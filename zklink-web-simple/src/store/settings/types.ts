import { ConnectionType } from 'connection/types'
import { MuiThemeType } from 'styles/Themes'

export interface MandatoryToastType {
  id: number
  expirationTime: number
  content: string
  createdAt: number
  notifyType: number
  title: string
}

export interface SettingState {
  theme: MuiThemeType
  connectorName: ConnectionType | undefined
  showPortfolio: boolean
  showBalanceInfo: boolean
  save: boolean
  mandatoryToast: MandatoryToastType
}
