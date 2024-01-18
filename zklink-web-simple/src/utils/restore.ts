import { isSaveToken } from 'store/settings/hooks'
import { Address } from 'types'
import storage from './storage'

interface RestoreKeys {
  ethereum: {
    [x: Address]: string
  }
}

const storageKey = 'rs'

function has(address: Address) {
  if (!isSaveToken()) {
    return false
  }
  const keys: RestoreKeys = storage.get(storageKey)

  if (!keys || !keys['ethereum'] || !keys['ethereum'][address]) {
    return false
  }

  return true
}

function get(address: Address): {
  signature: string
} | null {
  if (!isSaveToken()) {
    return null
  }
  const keys: RestoreKeys = storage.get(storageKey)

  if (!has(address)) {
    return null
  }

  return JSON.parse(keys['ethereum'][address])
}

function set(address: Address, signature: string) {
  if (!isSaveToken()) {
    return
  }

  let keys: RestoreKeys = storage.get(storageKey)

  if (!keys || !keys['ethereum']) {
    keys = {
      ethereum: {},
    }
  }

  keys['ethereum'][address] = JSON.stringify({
    signature,
  })
  storage.set(storageKey, keys)
}

function del(address: Address) {
  let keys: RestoreKeys = storage.get(storageKey)

  if (!keys || !keys['ethereum']) {
    keys = {
      ethereum: {},
    }
  }

  delete keys['ethereum'][address]
  storage.set(storageKey, keys)
}

function clean() {
  storage.remove(storageKey)
}

const restore = {
  has,
  get,
  set,
  del,
  clean,
}

export default restore
