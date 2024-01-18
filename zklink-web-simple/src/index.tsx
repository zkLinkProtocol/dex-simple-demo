import '__mocks__/index'
import 'polyfills'
import 'utils/console'

import 'connection/eagerlyConnect'

import 'i18n/index'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'react-toastify/dist/ReactToastify.css'
import { store } from 'store'
import App from 'views/index'
import './index.css'
import reportWebVitals from './reportWebVitals'

import '@fontsource/source-sans-pro/300.css'
import '@fontsource/source-sans-pro/400.css'
import '@fontsource/source-sans-pro/600.css'
import '@fontsource/source-sans-pro/700.css'

import '@fontsource/source-sans-pro/400-italic.css'

const container = document.getElementById('root') as HTMLElement
createRoot(container).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
