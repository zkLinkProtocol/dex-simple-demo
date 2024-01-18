import axios from 'axios'
import toastify from 'components/Toastify'
import { store } from 'store'
import { cleanRestore, disconnectProvider } from 'store/app/hooks'

export interface ApiV1Response<T = any> {
  code: number // 200
  msg: string // "success"
  data: T
}

export class ApiError extends Error {
  readonly msg: string = ''
  constructor(message: string, readonly code: number) {
    super(message)

    this.msg = message
  }
}

export const http = axios.create({
  headers: {},
  baseURL: process.env.REACT_APP_SERVER_ENDPOINT,
})

http.interceptors.request.use(
  (config) => {
    const state = store.getState()
    const { account } = state
    const { token = '' } = account
    if (token) {
      config.headers['Access-Token'] = token
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (response) => {
    const { data } = response

    const { code = 0, msg = '' } = data

    if (code === 200) {
      return response
    }

    if (code === 1009 && msg === 'AUTH_AUTHORIZATION_TOKEN_INVALID') {
      // User authorization token invalid, clear all user information
      disconnectProvider()
      cleanRestore()
    } else if (code === 1010 && msg === 'HEADER_TOKEN_EXPIRE') {
      // User authorization token expires, clear all user information
      disconnectProvider()
      cleanRestore()
    }

    return Promise.reject(new ApiError(response.data.msg, response.data.code))
  },
  (error) => {
    const { config, message } = error
    const { url } = config
    toastify.error(`${message}: ${url}`, {
      toastId: url,
    })

    return Promise.reject(error)
  }
)
