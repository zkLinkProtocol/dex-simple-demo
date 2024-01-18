import { Ether } from 'types'

// ---------- Range of mapping token id ----------
export const MAPPING_TOKEN_BEGIN = 2
export const MAPPING_TOKEN_END = 16

// ---------- Range of stable token id ----------
export const STABLE_TOKEN_BEGIN = 17
export const STABLE_TOKEN_END = 31

// ---------- USD token info ----------
export const PRIMARY_CURRENCY = 'USDC'
export const PRIMARY_CURRENCY_PRICE = 1
export const PRIMARY_CURRENCY_DECIMALS = 2

// ---------- Max amount for deposit and withdraw ----------
export const MAX_DEPOSIT_CURRENCY_QUANTITY: Ether = '1000000000000000000' // Math.pow(10, 18)

// ---------- block tokens for useTokenList ----------
export const BLOCKED_TOKENS: string[] = ['LineaUSDC']
