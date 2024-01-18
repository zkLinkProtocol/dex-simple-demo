import MockAdapter from 'axios-mock-adapter/types'
import { AddressZero } from 'utils/address'
import { getEthPropertyResult } from './getEthProperty'
import { getSupportChainsResult } from './getSupportChains'
import { getSupportTokensResult } from './getSupportTokens'
import { getTokenReserveResult } from './getTokenReserve'
import { getTransactionByHashResult } from './getTransactionByHash'

class Response {
  static error(
    statusCode: number,
    errorCode: number,
    errorMessage: string,
    id: number = 0
  ) {
    return [
      statusCode,
      {
        jsonrpc: '2.0',
        error: {
          code: errorCode,
          message: errorMessage,
        },
        id,
      },
    ]
  }
  static result(statusCode: number, result: any, id: number = 0) {
    return [
      statusCode,
      {
        jsonrpc: '2.0',
        result,
        id,
      },
    ]
  }
}

let activated = true
let deposited = true
export function mockJsonrpc(mocker: MockAdapter) {
  mocker.onPost().reply((config) => {
    const { data } = config
    const body = JSON.parse(data)

    console.groupCollapsed('[mockJsonrpc]', body.method)
    console.info('params: ', JSON.stringify(body.params))
    console.groupEnd()

    if (body.method === 'getAccount') {
      if (!deposited) {
        return Response.error(200, 201, 'Account not found')
      }
      if (!activated) {
        return Response.result(
          200,
          {
            id: 43,
            address: '0x3498f456645270ee003441df82c718b56c0e6666',
            nonce: 0,
            pubKeyHash: AddressZero,
            subAccountNonces: {
              '0': 0,
            },
          },
          body.id
        )
      }

      return Response.result(
        200,
        {
          id: 43,
          address: '0x3498f456645270ee003441df82c718b56c0e6666',
          nonce: 1,
          pubKeyHash: '0x61df4b78cb66c301f07a0fb0ea0cb4a1c022a82b',
          subAccountNonces: {
            '0': 0,
            '2': 8,
          },
        },
        body.id
      )
    }

    if (body.method === 'getAccountBalances') {
      return Response.result(
        200,
        {
          '0': {
            '17': '20000000000000000000',
          },
        },
        body.id
      )
    }
    if (body.method === 'getSupportChains') {
      return Response.result(200, getSupportChainsResult, body.id)
    }

    if (body.method === 'getSupportTokens') {
      return Response.result(200, getSupportTokensResult, body.id)
    }

    if (body.method === 'getEthProperty') {
      return Response.result(200, getEthPropertyResult, body.id)
    }

    if (body.method === 'getChangePubkeyChainId') {
      return Response.result(200, 7, body.id)
    }

    if (body.method === 'getTokenReserve') {
      return Response.result(200, getTokenReserveResult, body.id)
    }

    if (body.method === 'sendTransaction') {
      if (body.params[0].type === 'ChangePubKey') {
        setTimeout(() => {
          activated = true
        }, 10000)
      }
      if (body.params[0].type === 'Withdraw') {
      }
      return Response.result(
        200,
        '0x2ec23336058c3c28c89123649611432eaff9e2a2137cc07904c4d0387740a549',
        body.id
      )
    }

    if (body.method === 'getTransactionByHash') {
      return Response.result(200, getTransactionByHashResult, body.id)
    }

    return Response.result(200, {}, body.id)
  })
}
