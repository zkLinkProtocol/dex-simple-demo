import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { formatEther, parseUnits } from '@ethersproject/units'
import numbro from 'numbro'
import { Ether, Wei } from 'types'

// Convert scientific notation to string.
// e.g. 1e25 -> '10000000000000000000000000'
export function numberToString(num: number): string {
  if (typeof num !== 'number' && typeof num !== 'string') {
    return ''
  }
  if (typeof num === 'string') {
    num = Number(num)
  }
  if (isNaN(num)) {
    return ''
  }
  return num.toString()
}

export function parseWeiToEther(
  wei: Wei | BigNumber, // '1000000000000000000'
  digits: number = 18, // default 18
): string {
  if (!wei) {
    return '0'
  }

  if (BigNumber.isBigNumber(wei)) {
    wei = wei.toString()
  }
  wei = toFixed(wei, 0)
  if (isZero(wei)) {
    return '0'
  }

  let ether = formatEther(wei)
  const es = ether.split('.')
  if (isZero(es[1])) {
    ether = es[0]
  }
  return toFixed(ether, digits)
}

export function parseEtherToWei(
  amount: Ether | number, // '10' | '0.1' | '333'
): BigNumber {
  if (isZero(amount)) {
    return BigNumber.from(0)
  }
  if (typeof amount === 'number') {
    amount = numberToString(amount)
  }
  const safeAmount = toFixed(amount, 18)
  return parseUnits(safeAmount, 18)
}

export function isZero(amount: BigNumber | string | number | undefined) {
  if (!amount) return true
  if (BigNumber.isBigNumber(amount))
    return Number(BigNumber.from(amount).toString()) <= 0
  else return !amount || !Number(amount)
}

export function toFixed(
  amount: Ether | number,
  decimals: number = 18,
  options?: {
    fixed?: boolean
  },
) {
  if (amount === '' || amount === undefined || amount === null) return ''
  if (decimals > 18) decimals = 18
  if (decimals < 0) decimals = 0
  if (typeof amount !== 'string') amount = String(amount)
  const arr = amount.split('.')
  if (decimals === 0) return arr[0]
  const len = arr[1]?.length ? arr[1].length : 0
  if (len > decimals) arr[1] = arr[1].slice(0, decimals)
  if (options?.fixed) {
    arr[1] = arr[1] ?? ''
    for (let i = 0, l = decimals - len; i < l; i++) arr[1] = arr[1] + '0'
  }
  if (arr[1] === undefined) return arr[0]
  else return arr[0] + '.' + arr[1]
}

export const inputNumberExp = (value: string): string => {
  if (!value) return ''
  return value.replace(/[^\d\.]/g, '').replace(/(\.)(\d*)(\1*)/g, '$1$2')
}

export function toGrouping(num: number | string, mantissa: number = 2) {
  return numbro(num).format({ thousandSeparated: true, mantissa })
}

export function bn(num?: BigNumberish) {
  return BigNumber.from(num)
}

export const w2e = parseWeiToEther
export const e2w = parseEtherToWei

// Returns the maximum value in a BigNumber array
export function maxBigNumber(values: BigNumberish[]) {
  return values.reduce<BigNumber>((previous, current) => {
    if (bn(current).gt(previous)) {
      return bn(current)!
    } else {
      return previous
    }
  }, bn(0))
}

// Returns the effective number of decimal places in a number
export function getEffectiveDecimals(value: Ether | number, scale: number = 2) {
  let amount = toFixed(value, scale)
  while (+value !== 0 && +amount === 0 && scale < 18) {
    scale += 1
    amount = toFixed(value, scale)
  }
  return amount
}

// Returns the number of decimal places in a number
export function countDecimals(value: number): number {
  if (Math.floor(value) === value) return 0 // If it's an integer, there are no decimal places
  const str = value.toString()
  if (str.indexOf('.') !== -1 && str.indexOf('e-') === -1) {
    // Check for a normal decimal
    return str.split('.')[1].length // Return the length of the decimal part
  } else if (str.indexOf('e-') !== -1) {
    // Check for scientific notation
    const base =
      str.split('e-')[0].split('.').length > 1
        ? str.split('e-')[0].split('.')[1].length
        : 0
    const exponent = parseInt(str.split('e-')[1], 10)
    return base + exponent // Adjust for the exponent in scientific notation
  } else {
    return 0 // No decimal point or scientific notation without a decimal part
  }
}

export function numberToHex(num: number | string) {
  if (typeof num === 'string' && num.startsWith('0x')) return num
  return `0x${Number(num).toString(16)}`
}
