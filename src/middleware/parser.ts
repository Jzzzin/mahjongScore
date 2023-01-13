import { Middleware } from 'koa'
import bodyparser from 'koa-bodyparser'

function parser(): Middleware {
  return bodyparser({
    enableTypes: ['json']
  })
}

export default parser
