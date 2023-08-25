import compose from 'koa-compose'

import cors from './cors'
import logger from './logger'
import parser from './parser'
import router from './router'
import koaStatic from './static'
import jwtMiddleware from './jwt'

export default compose([
  cors(),
  logger(),
  parser(),
  koaStatic(),
  // jwtMiddleware,
  router.routes(),
  router.allowedMethods()
])
