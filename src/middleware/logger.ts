import { Middleware } from 'koa'
import pino from 'koa-pino-logger'

function logger(): Middleware {
  return pino({
    prettyPrint: {
      translateTime: 'SYS:standard',
      ignore: 'res,responseTime,req',
      messageFormat: (log) => {
        if (log.req) return `${String(log.responseTime ?? '')}ms - ${String(log.msg)} - REQ[${String(log.req.method)}-${String(log.req.headers.host)}${String(log.req.url)}] ${String(log.res?.statusCode ?? '')}`
        return `${String(log.msg)}`
      }
    }
  })
}

export default logger
