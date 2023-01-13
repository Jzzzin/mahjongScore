import { connectionTest } from './database/helper'
import app from './app'
import { SERVER as CONFIG } from './config'

async function exec() {
  await connectionTest()
  app.listen(CONFIG.PORT)
}

exec().then(
  () => console.log('SERVER running at', CONFIG.PORT),
  (e) => console.error(e)
)
