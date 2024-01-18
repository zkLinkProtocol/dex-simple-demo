const Koa = require('koa')
const Router = require('koa-router')
const cors = require('koa2-cors')
const bodyParser = require('koa-bodyparser')
const { submitTx } = require('./sign.js')

const app = new Koa()
const router = new Router()

app.use(bodyParser())

app.use(cors())

router.post('/layer2/repeater', async (ctx) => {
  try {
    const { ethSignature, txData } = ctx.request.body

    const txHash = await submitTx(txData, ethSignature)

    ctx.body = {
      code: 200,
      data: {
        txHash,
      },
    }
  } catch (e) {
    ctx.body = {
      code: 500,
      msg: e?.message,
    }
  }
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)
