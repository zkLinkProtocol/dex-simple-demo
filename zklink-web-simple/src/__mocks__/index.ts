import MockAdapter from 'axios-mock-adapter'
import { MOCK_ENABLED, isProduction } from 'config'
import { zklinkAxios } from './../api/v3/jsonrpc'
import { mockJsonrpc } from './routes/jsonrpc'

export const mocker = new MockAdapter(zklinkAxios, {
  onNoMatch: 'passthrough',
})

if (!isProduction && MOCK_ENABLED) {
  mockJsonrpc(mocker)

  const div = document.createElement('div')
  div.innerHTML = 'Mock Enabled'
  div.style.cssText =
    'font-size:10px;color:white;padding:2px 6px;background:rgba(238, 149, 0, .8);border-radius:0 0 2px 2px;position:fixed;top:0;left:50%;z-index:10000;'
  document.documentElement.appendChild(div)
}
