import { Middleware } from 'koa'
import serve from 'koa-static'
import * as path from 'path'

function koaStatic(): Middleware {
  return serve(path.join(__dirname, '../../dist'))
}

export default koaStatic
