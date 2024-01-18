import { StorageType } from 'utils/storage'

function boolean(envValue: string | boolean) {
  return envValue === 'true' || envValue === true ? true : false
}

type EnvType = 'devnet' | 'testnet' | 'mainnet'
// ---------- server endpoints ----------
export const ENV: EnvType = process.env.REACT_APP_ENV! as EnvType

export const isProduction = process.env.NODE_ENV === 'production'

export const isMainnet = ENV === 'mainnet'

export const ZKLINK_ENDPOINT = process.env.REACT_APP_ZKLINK_ENDPOINT!
export const ZKLINK_STATIC_ENDPOINT =
  process.env.REACT_APP_ZKLINK_STATIC_ENDPOINT!
export const ZKLINK_SCAN_ENDPOINT = process.env.REACT_APP_ZKLINK_SCAN_ENDPOINT!
export const ZKLINK_SCAN_API_ENDPOINT =
  process.env.REACT_APP_ZKLINK_SCAN_API_ENDPOINT!
export const ZKLINK_BROKER_API_ENDPOINT =
  process.env.REACT_APP_ZKLINK_BROKER_API_ENDPOINT!

export const MOCK_ENABLED = false

// ---------- sub account id ----------
export const SUB_ACCOUNT_ID = 11

// ---------- storage ----------
// When the user turns on the remember switch, the signature will be stored in the browser storage.
export const STORAGE_TYPE = process.env.REACT_APP_STORAGE_TYPE! as StorageType
// Prefix is used to differentiate between devnet, testnet, and mainnet. Example: devnet: dn_, testnet: tn_, mainnet: mn_
export const STORAGE_PREFIX = process.env.REACT_APP_STORAGE_PREFIX!
// Used to control the expiration time of storage.
export const STORAGE_EXPIRE = Number(process.env.REACT_APP_STORAGE_EXPIRE!) ?? 0
// Used to control whether to use encrypted text to store in the browser.
export const STORAGE_ENCRYPT = boolean(process.env.REACT_APP_STORAGE_ENCRYPT!)

// ---------- maintenance ----------
// Option: true. Will display the website interface as under maintenance status.
// Option: false. No impact on the interface.
export const SHOW_MAINTENANCE_MODEL = boolean(
  process.env.REACT_APP_MAINTENANCE!
)

// ---------- WalletConnect ----------
export const WALLET_CONNECT_PROJECT_ID =
  process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID!

// ---------- google recaptcha ----------
// Option: true. Enable google reCAPTCHA in faucet.
// Option: false. No impact on the interface.
export const ENABLE_GRECAPTCHA = boolean(
  process.env.REACT_APP_GRECAPTCHA_ENABLED!
)
// GRECAPTCHA_KEY: String. google reCAPTCHA API key.
export const GRECAPTCHA_KEY = process.env.REACT_APP_GRECAPTCHA_KEY!

// ---------- polling interval for account info ----------
export const ACCOUNT_INFO_POLLING_INTERVAL = 10000
export const ORDER_FEE_RATE_POLLING_INTERVAL = 60000

export const Pow18 = '1000000000000000000'
