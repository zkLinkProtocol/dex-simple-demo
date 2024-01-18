import { createReducer } from '@reduxjs/toolkit'
import {
  updateConnectorName,
  updateSaveToken,
  updateShowBalanceInfo,
  updateShowMandatoryToast,
  updateShowPortfolio,
  updateTheme,
} from 'store/settings/actions'
import { SettingState } from 'store/settings/types'
import { MuiThemeType } from 'styles/Themes'

export const initialState: SettingState = {
  theme: MuiThemeType.dark,
  connectorName: undefined,
  showPortfolio: true,
  showBalanceInfo: true,
  save: false,
  mandatoryToast: {
    id: 0,
    expirationTime: 0,
    content: '',
    createdAt: 0,
    notifyType: 1,
    title: '',
  },
}

export default createReducer<SettingState>(initialState, (builder) => {
  builder
    .addCase(updateTheme, (state, { payload }) => {
      state.theme = payload
    })
    .addCase(updateConnectorName, (state, { payload }) => {
      state.connectorName = payload.connectorName
    })
    .addCase(updateShowPortfolio, (state, { payload }) => {
      state.showPortfolio = payload
    })
    .addCase(updateShowBalanceInfo, (state, { payload }) => {
      state.showBalanceInfo = payload
    })
    .addCase(updateSaveToken, (state, { payload }) => {
      state.save = payload
    })
    .addCase(updateShowMandatoryToast, (state, { payload }) => {
      state.mandatoryToast = { ...payload }
    })
})
