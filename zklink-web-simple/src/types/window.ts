import { compose } from 'redux'

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose
    tvWidget?: any
    TradingView?: any
    Datafeeds?: any
    g_k_ticker?: any
    ws?: any
    binanceWs?: any
    gtag?: any
    grecaptcha?: any
  }
}
