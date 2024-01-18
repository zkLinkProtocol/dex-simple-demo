import { isSaveToken } from 'store/settings/hooks'
import { Address } from 'types'
import storage from './storage'

interface Authorization {
  [x: Address]: string
}

const storageKey = 'au'

function has(address: Address) {
  if (!isSaveToken()) {
    return false
  }
  const auth: Authorization = storage.get(storageKey)

  if (!auth || !auth[address]) {
    return false
  }

  return true
}

function get(address: Address) {
  if (!isSaveToken()) {
    return null
  }
  const auth: Authorization = storage.get(storageKey)

  if (!has(address)) {
    return null
  }

  return auth[address]
}

function set(address: Address, token: string) {
  if (!isSaveToken()) {
    return
  }
  let auth: Authorization = storage.get(storageKey)

  if (!auth) {
    auth = {}
  }

  auth[address] = token
  storage.set(storageKey, auth)
}

function del(address: Address) {
  let auth: Authorization = storage.get(storageKey)

  if (!auth) {
    auth = {}
  }

  delete auth[address]
  storage.set(storageKey, auth)
}

function clean() {
  storage.remove(storageKey)
}

const authorization = {
  has,
  get,
  set,
  del,
  clean,
}

export default authorization
