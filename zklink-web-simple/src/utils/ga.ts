export enum GaEventName {
  click_nav_connect_wallet = 'click_nav_connect_wallet',
  click_nav_network = 'click_nav_network',
  change_nav_network = 'change_nav_network',

  click_balance_history = 'click_balance_history',
  click_search_market = 'click_search_market',
  click_all_market = 'click_all_market',
  click_account_modal = 'click_account_modal',
  click_faucet = 'click_faucet',
  click_hide_other_pairs = 'click_hide_other_pairs',
  click_order_history = 'click_order_history',
  click_trade_history = 'click_trade_history',
  click_change_theme = 'click_change_theme',
  click_orderbook_price = 'click_orderbook_price',
  click_orderbook_amount = 'click_orderbook_amount',
  click_orderbook_total = 'click_orderbook_total',
  click_order_connect_wallet = 'click_order_connect_wallet',
  click_order_percent_slider = 'click_order_percent_slider',
  click_order_percent_amount = 'click_order_percent_amount',
  click_buy = 'click_buy',
  click_sell = 'click_sell',
  click_footer_userguide = 'click_footer_userguide',
  click_footer_discord = 'click_footer_discord',
  click_footer_bugreport = 'click_footer_bugreport',

  change_orderbook_precision = 'change_orderbook_precision',
  claim_faucet = 'claim_faucet',
  request_deposit = 'request_deposit',
  request_withdraw = 'request_withdraw',
}

export function gaEvent(
  eventName: GaEventName,
  args?: {
    [x: string]: string | number | boolean
  }
) {
  try {
    window.gtag('event', eventName, args)
  } catch (e: any) {}
}
