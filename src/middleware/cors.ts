import { Middleware } from 'koa'
import cors from '@koa/cors'

function createCorsMiddleware(): Middleware {
  return cors({
    origin: (ctx) => {
      const origin = ctx.request.header.origin
      const allowList = [
        'http://localhost',
        'http://localhost:3000',
        'http://localhost:8001',
        'http://mahjong.cafe24app.com',
        'http://mahjong.cafe24app.com:8001',
        'http://112.175.184.60'
      ]

      if (origin && allowList.includes(origin)) return origin
      return 'http://167.179.98.132:8081'
    },
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
    exposeHeaders: 'Content-Disposition'
  })
}

export default createCorsMiddleware
