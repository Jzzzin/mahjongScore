import Router from 'koa-router'
import * as controller from '../api/controller'

const router = new Router()

router.get('/api/member', controller.findMemberList)
router.post('/api/member', controller.createMember)

router.get('/api/member/:memberNo', controller.findMember)
router.put('/api/member/:memberNo', controller.updateMember)

router.get('/api/location', controller.findLocationList)

router.get('/api/meet', controller.findMeetList)
router.post('/api/meet', controller.createMeet)

router.get('/api/meet/:meetNo', controller.findMeet)
router.put('/api/meet/:meetNo', controller.updateMeet)

router.get('/api/game', controller.findGameList)
router.post('/api/game', controller.createGame)

router.get('/api/meetForGame', controller.findMeetForGameList)

router.put('/api/game/result', controller.updateGameMemberMap)

router.get('/api/game/:gameNo', controller.findGame)
router.put('/api/game/:gameNo', controller.updateGame)

router.get('/api/rank', controller.findRankList)

router.post('/api/login', controller.login)

export default router
