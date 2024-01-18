import { Theme } from '@mui/material'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState, store } from 'store'
import { muiThemes, MuiThemeType } from 'styles/Themes'
import { MandatoryToastType } from './types'
import { getRecentConnectionMeta } from '../../connection/meta'

export function useCurrentTheme(): Theme {
  const themeType = useSelector<RootState, MuiThemeType>(
    (state) => state.settings.theme
  )
  return useMemo(() => {
    return muiThemes[themeType]
  }, [themeType])
}
export function useCurrentThemeType(): MuiThemeType {
  return useSelector<RootState, MuiThemeType>((state) => state.settings.theme)
}
export function useCurrentConnectorName() {
  return getRecentConnectionMeta()?.type
}
export function useShowPortfolio() {
  return useSelector<RootState, boolean>(
    (state) => state.settings.showPortfolio
  )
}
export function useShowBalanceInfo() {
  return useSelector<RootState, boolean>(
    (state) => state.settings.showBalanceInfo
  )
}
export function useSaveToken() {
  return useSelector<RootState, boolean>((state) => state.settings.save)
}
export function isSaveToken() {
  const state = store.getState()
  return state.settings.save
}

export function useMandatoryToast() {
  return useSelector<RootState, MandatoryToastType>(
    (state) => state.settings.mandatoryToast
  )
}
