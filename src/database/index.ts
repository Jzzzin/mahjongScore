import mysql from 'mysql2'
import { DB as CONFIG } from '../config'
import { setNamesUtf8 } from './helper'

const mahjongScoreConfig: mysql.PoolOptions = {
  host: CONFIG.MAHJONG_SCORE.HOST,
  user: CONFIG.MAHJONG_SCORE.USER,
  password: CONFIG.MAHJONG_SCORE.PASSWORD,
  database: CONFIG.MAHJONG_SCORE.DATABASE,
  multipleStatements: CONFIG.MAHJONG_SCORE.multipleStatements
}
export const DB_MAHJONG_SCORE = mysql
  .createPool(mahjongScoreConfig)
  .on('connection', async () => await setNamesUtf8())
  .promise()
