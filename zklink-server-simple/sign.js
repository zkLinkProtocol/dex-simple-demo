const { Signer } = require('./node-dist/zklink-sdk-node')
const fetch = require('node-fetch')
const { submitterKey } = require('./.secret.json')

const submitterSigner = new Signer(submitterKey)

function zkSign(tx) {
  const signed = submitterSigner.submitterSignature(tx)
  return {
    pubKey: signed.pubKey(),
    signature: signed.signature(),
  }
}

async function submitTx(tx, l1_signature) {
  const submitterSignature = zkSign(tx)

  const r = await fetch('https://aws-gw-v2.zk.link', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'sendTransaction',
      params: [tx, l1_signature, submitterSignature],
    }),
  }).then((r) => r.json())

  if (r.error) {
    throw new Error(r.error.message)
  }

  return r.result
}

module.exports = { submitTx }
