import Koa from 'koa'
import middleware from './middleware'

const app = new Koa()
app.use(middleware)

export default app
