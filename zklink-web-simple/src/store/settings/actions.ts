import { createAction } from '@reduxjs/toolkit'
import { ConnectionType } from 'connection/types'
import { MuiThemeType } from 'styles/Themes'
import { MandatoryToastType } from './types'

export const updateTheme = createAction<MuiThemeType>('settings/updateTheme')
export const updateConnectorName = createAction<{
  connectorName: ConnectionType | undefined
}>('settings/updateConnectorName')
export const updateShowPortfolio = createAction<boolean>(
  'settings/updateShowPortfolio'
)
export const updateShowBalanceInfo = createAction<boolean>(
  'settings/updateShowBalanceInfo'
)
export const updateSaveToken = createAction<boolean>('settings/updateSaveToken')
export const updateShowMandatoryToast = createAction<MandatoryToastType>(
  'settings/updateShowMandatoryToast'
)
