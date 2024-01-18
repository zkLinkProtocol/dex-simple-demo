import {
  STORAGE_ENCRYPT,
  STORAGE_EXPIRE,
  STORAGE_PREFIX,
  STORAGE_TYPE,
} from 'config'
import CryptoJS from 'crypto-js'

type Seconds = number
type StorageKey = string
interface StorageValue {
  value: any
  expire: number
}

export type StorageType = 'localStorage' | 'sessionStorage'

const storageConfig: {
  type: 'localStorage' | 'sessionStorage'
  prefix: string
  expire: Seconds
  isEncrypt: boolean
  secretKey: CryptoJS.lib.WordArray
  secretIV: CryptoJS.lib.WordArray
} = {
  type: STORAGE_TYPE,
  prefix: STORAGE_PREFIX,
  expire: STORAGE_EXPIRE,
  isEncrypt: STORAGE_ENCRYPT,
  secretKey: CryptoJS.enc.Utf8.parse('968604562a14e8a0'),
  secretIV: CryptoJS.enc.Utf8.parse('8ab73560b4e40921'),
}

function isSupportStorage() {
  if (!window) {
    throw new Error(
      'The current environment is not a browser, and the global window instance cannot be consumed.'
    )
  }
  if (!window.localStorage) {
    throw new Error('LocalStorage connot be used in the current environment.')
  }
  if (!window.sessionStorage) {
    throw new Error('SessionStorage cannot be used in the current environment.')
  }

  return typeof Storage !== 'undefined' ? true : false
}

function setStorage(
  key: string,
  value: number | string | object | null | undefined,
  expire = 0
) {
  if (value === '' || value === null || value === undefined) {
    value = null
  }

  if (isNaN(expire) || expire < 0) throw new Error('Expire must be a number')

  expire = expire ? expire : storageConfig.expire
  const data: StorageValue = {
    value: value,
    expire: expire && expire > 0 ? Date.now() + expire * 1000 : 0,
  }
  const encryptString = encodeStorage(data)

  if (encryptString) {
    window[storageConfig.type].setItem(prefix(key), encryptString)
  }
}

function encodeStorage(data: StorageValue): string | null {
  try {
    return storageConfig.isEncrypt
      ? encrypt(JSON.stringify(data))
      : JSON.stringify(data)
  } catch (e) {
    return null
  }
}

function decodeStorage(item: string): StorageValue | null {
  try {
    return storageConfig.isEncrypt
      ? JSON.parse(decrypt(item ?? ''))
      : JSON.parse(item ?? '')
  } catch (e) {
    return null
  }
}

function getStorageObject(key: string) {
  const item = window[storageConfig.type].getItem(key)
  if (!item || JSON.stringify(item) === 'null') {
    return null
  }
  return decodeStorage(item)
}

function isExpire(storage: StorageValue) {
  return storage.expire && storage.expire < Date.now()
}

function getStorage(key: string) {
  let value = null
  key = prefix(key)
  const storage = getStorageObject(key)
  if (!storage) {
    return null
  }
  if (isExpire(storage)) {
    removeStorage(key)
    return null
  } else {
    if (isJson(storage.value)) {
      value = JSON.parse(storage.value)
    } else {
      value = storage.value
    }
    return value
  }
}

function hasStorage(key: StorageKey) {
  return !!window[storageConfig.type].getItem(prefix(key))
}

function removeStorage(key: StorageKey) {
  window[storageConfig.type].removeItem(prefix(key))
}

function isJson(value: any) {
  if (Object.prototype.toString.call(value) === '[object String]') {
    try {
      const obj = JSON.parse(value)
      const objType = Object.prototype.toString.call(obj)
      return objType === '[object Object]' || objType === '[object Array]'
    } catch (e) {
      return false
    }
  }
  return false
}

function prefix(key: StorageKey) {
  const prefix = storageConfig.prefix ? storageConfig.prefix + '_' : ''
  return prefix + key
}

function autoRemovePrefix(key: StorageKey) {
  const len = storageConfig.prefix ? storageConfig.prefix.length + 1 : 0
  return key.substring(len)
}
function encrypt(data: number | string | boolean | object) {
  if (typeof data === 'object') {
    try {
      data = JSON.stringify(data)
    } catch (error) {
      console.error('encrypt error:', error)
    }
  }
  if (typeof data === 'string') {
    const dataHex = CryptoJS.enc.Utf8.parse(data)
    const encrypted = CryptoJS.AES.encrypt(dataHex, storageConfig.secretKey, {
      iv: storageConfig.secretIV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.ciphertext.toString()
  } else {
    console.error('encrypt data type error')
  }
  return null
}

function decrypt(data: string) {
  const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
  const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  const decrypt = CryptoJS.AES.decrypt(str, storageConfig.secretKey, {
    iv: storageConfig.secretIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
  return decryptedStr.toString()
}

function clean() {
  const storages = window[storageConfig.type]
  for (let i in storages) {
    if (i.indexOf(prefix('')) >= 0) {
      const value = decodeStorage(storages[i])
      if (!value) {
        continue
      }
      if (isExpire(value)) {
        window[storageConfig.type].removeItem(i)
      }
    }
  }
}

function watchStorage() {
  clean()
  window.setInterval(() => {
    clean()
  }, 10 * 1000)
}

watchStorage()

const storage = {
  set: setStorage,
  get: getStorage,
  has: hasStorage,
  remove: removeStorage,
}

export default storage
