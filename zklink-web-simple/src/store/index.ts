import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { combineReducers } from 'redux'
import { load, save } from 'redux-localstorage-simple'
import accountReducer from 'store/account/reducer'
import appReducer from 'store/app/reducer'
import depositReducer, {
  initialState as depositInitialState,
} from 'store/deposit/reducer'
import historyReducer from 'store/history/reducer'
import linkReducer from 'store/link/reducer'
import settingReducer, {
  initialState as settingsInitialState,
} from 'store/settings/reducer'
import withdrawReducer from 'store/withdraw/reducer'

const rootReducer = combineReducers({
  account: accountReducer,
  app: appReducer,
  deposit: depositReducer,
  history: historyReducer,
  link: linkReducer,
  settings: settingReducer,
  withdraw: withdrawReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

const persistedStates: string[] = ['settings', 'deposit.pendingTxs']
const namespace: string = 'zklink_v3_1'
const namespaceSeparator: string = '::'

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      // {
      //   ignoredPaths: ['link.wallet'],
      //   ignoredActionPaths: ['payload.wallet'],
      // },
    }).concat(
      save({
        states: persistedStates,
        namespace,
        namespaceSeparator,
        debounce: 1000,
      })
    ),
  preloadedState: (function () {
    const storedData: any = load({
      states: persistedStates,
      namespace,
      namespaceSeparator,
      disableWarnings: process.env.NODE_ENV === 'test',
    })

    storedData.deposit = {
      ...depositInitialState,
      ...storedData.deposit,
    }

    storedData.settings = {
      ...settingsInitialState,
      ...storedData.settings,
    }
    return storedData
  })(),
})
