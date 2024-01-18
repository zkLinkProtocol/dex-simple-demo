import { lowerCase, upperCase } from 'lodash'
import { Address } from '../types'

export const AddressZero = '0x0000000000000000000000000000000000000000'
export const AddressGas = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

export function isZeroAddress(tokenAddress: Address): boolean {
  if (!tokenAddress) {
    return false
  }
  return AddressZero === tokenAddress
}

export function isGasAddress(tokenAddress: Address): boolean {
  if (!tokenAddress) {
    return false
  }
  return AddressGas.toLowerCase() === tokenAddress.toLowerCase()
}

export const encryptionAddress = (
  address: Address,
  start: number = 6,
  end: number = 4
) => {
  if (!address) {
    return ''
  }
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

export function equalByLowerCase(a?: string, b?: string): boolean {
  if (a === undefined || b === undefined) {
    return false
  }
  return lowerCase(a) === lowerCase(b)
}

export function equalByUpperCase(a?: string, b?: string): boolean {
  if (a === undefined || b === undefined) {
    return false
  }
  return upperCase(a) === upperCase(b)
}
