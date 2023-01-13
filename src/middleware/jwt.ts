import type { Context, Middleware } from 'koa'
import * as jwt from '../api/jwt'
import * as CONST from '../api/const'

const jwtMiddleware: Middleware = async (ctx: Context, next: any) => {
  if (ctx.state.jwtOriginalError) {
    console.log(`*** Jwt Verification Error [${String(ctx.state.jwtOriginalError.name)}] ***`)
    ctx.status = 401
  } else {
    console.log('*** Jwt Middleware Start ***')
    const token = ctx.request.header.authorization?.substring(7)
    let authYn = false
    if (!token) {
      const method = ctx.method
      const pathname = ctx.URL.pathname
      if (pathname.includes(CONST.PATHNAME.Login)) {
          console.log(`*** Pass Auth Check: Path[${pathname}]***`)
          authYn = true
      } else {
          if (method !== 'GET') {
            console.log(`*** Token Required: Method[${method}] Path[${pathname}]***`)
          } else {
            authYn = true
          }
      }
    } else {
      try {
        const decodedToken = await jwt.decodeToken(token)
        if (decodedToken) {
          authYn = true
          if (Number(decodedToken.exp) - Date.now() / 1000 < 1800) {
            console.log('*** Token Refresh!!! ***')
            const freshToken = await jwt.refreshToken(token)
            ctx.request.header.authorization = 'Bearer ' + freshToken
          }
        }
      } catch (e) {
        console.log(e)
      }
    }

    if (authYn) return next()
    else {
      ctx.status = 403
    }
  }
}

export default jwtMiddleware
