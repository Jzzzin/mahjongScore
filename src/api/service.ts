import type { Context } from 'koa'
import type {
    FindGameFilter,
    FindMeetFilter,
    FindMemberFilter, FindRankFilter,
    GameDetail,
    GameList, GameMemberParam,
    GameParam, LoginInfo, LoginParam,
    MeetList,
    MeetParam,
    MemberData,
    MemberParam, RankList
} from './typeDef'
import type {UpdateGameMemberMapParam} from "./access";
import * as access from './access'
import * as jwt from './jwt'
import {getMysqlDatetime} from "./util";

export async function findMemberList(ctx: Context, filter: FindMemberFilter): Promise<MemberData[]> {
  ctx.log.info('*** Find Member List Service Start ***')

  let list: MemberData[] = []

  const countData = await access.findMemberCount(filter)

  if (countData.length > 0 && countData[0]['count(*)']) {
    list = await access.findMemberList(filter)
  }

  return list
}

export async function findMember(ctx: Context, memberNo: number): Promise<MemberData> {
  ctx.log.info('*** Find Member Service Start ***')

  return await access.findMember(memberNo)
}

export async function createMember(ctx: Context, param: MemberParam) {
  ctx.log.info('*** Create Member Service Start ***')

  let result = 0

  const duplicated = await access.findMemberForValidate(param.memberName)
  console.log(`*** Member No [${duplicated.toString()}] For Member Name[${param.memberName}]`)
  if (duplicated === 0) {
    const createResult = await access.createMember({ memberName: param.memberName })
    result = createResult.insertId
  }
  return result
}

export async function updateMember(ctx: Context, param: MemberParam) {
  ctx.log.info('*** Update Member Service Start ***')

  let result = 0

  const duplicated = await access.findMemberForValidate(param.memberName)
  console.log(`*** Member No [${duplicated.toString()}] For Member Name[${param.memberName}]`)
  if (duplicated === 0 || duplicated === Number(param.memberNo)) {
    const updateResult = await access.updateMember(param)
    result = updateResult.affectedRows
  }
  return result
}

export async function findMeetList(ctx: Context, filter: FindMeetFilter): Promise<MeetList[]> {
  ctx.log.info('*** Find Meet List Service Start ***')

  let list: MeetList[] = []

  const countData = await access.findMeetCount(filter)

  if (countData.length > 0 && countData[0]['count(*)']) {
    const meetData = await access.findMeetList(filter)
    const meetMemberMapData = await access.findMeetMemberMapList()
    meetData.forEach(value => {
      const meetList: MeetList = {
        ...value,
        memberList: meetMemberMapData.filter(map => map.meetNo === value.meetNo)
      }
      list.push(meetList)
    })
  }

  return list
}

export async function findMeet(ctx: Context, meetNo: number): Promise<MeetList> {
  ctx.log.info('*** Find Meet Service Start ***')

  const meetWithMember =  await access.findMeetWithMember(meetNo)
  return {
    meetNo: meetWithMember[0].meetNo,
    meetDay: meetWithMember[0].meetDay,
    meetTime: meetWithMember[0].meetTime,
    location: meetWithMember[0].location,
    endYn: meetWithMember[0].endYn,
    memberList: meetWithMember.map(value => { return { meetNo: value.meetNo, memberNo: value.memberNo, memberName: value.memberName, attendYn: value.attendYn }})
  }
}

export async function createMeet(ctx: Context, param: MeetParam) {
  ctx.log.info('*** Create Meet Service Start ***')

  let result = 0

  const duplicated = await access.findMeetForValidate(param.meetDay)
  console.log(`*** Meet No [${duplicated.toString()}] For Meet Day[${param.meetDay}]`)
  if (duplicated === 0) {
    const createResult = await access.createMeet({ meetDay: param.meetDay, meetTime: param.meetTime, location: param.location })
    result = createResult.insertId

    if (result > 0) {
      const mapResult = await access.createMeetMemberMap(result)
      if (mapResult) await access.updateMeetMemberMap({ meetNo: result, memberNoList: param.memberNoList })
    }
  }

  return result
}

export async function updateMeet(ctx: Context, param: MeetParam) {
  ctx.log.info('*** Update Meet Service Start ***')

  let result = 0

  const duplicated = await access.findMeetForValidate(param.meetDay)
  console.log(`*** Meet No [${duplicated.toString()}] For Meet Day[${param.meetDay}]`)
  if (duplicated === 0 || duplicated === Number(param.meetNo)) {
    const updateResult = await access.updateMeet(param)
    if (updateResult) await access.updateMeetMemberMap({ meetNo: param.meetNo, memberNoList: param.memberNoList })

    result = updateResult.affectedRows
  }

  return result
}

export async function findGameList(ctx: Context, filter: FindGameFilter): Promise<GameList[]> {
  ctx.log.info('*** Find Game List Service Start ***')

  let list: GameList[] = []

  const countData = await access.findGameCount(filter)

  if (countData.length > 0 && countData[0]['count(*)']) {
    const gameData = await access.findGameList(filter)
    const gameMemberMapData = await access.findGameMemberMapList()
    gameData.forEach(value => {
      const gameList: GameList = {
        ...value,
        memberList: gameMemberMapData.filter(map => map.gameNo === value.gameNo)
      }
      list.push(gameList)
    })
  }

  return list
}

export async function findGame(ctx: Context, gameNo: number): Promise<GameDetail> {
  ctx.log.info('*** Find Game Service Start ***')

  const gameWithMember =  await access.findGameWithMember(gameNo)
  return {
    gameNo: gameWithMember[0].gameNo,
    meetNo: gameWithMember[0].meetNo,
    meetDay: gameWithMember[0].meetDay,
    gameNumber: gameWithMember[0].gameNumber,
    gameMemberCount: gameWithMember[0].gameMemberCount,
    gameType: gameWithMember[0].gameType,
    startScore: gameWithMember[0].startScore,
    returnScore: gameWithMember[0].returnScore,
    okaPoint: gameWithMember[0].okaPoint,
    umaPoint: gameWithMember[0].umaPoint,
    endYn: gameWithMember[0].endYn,
    memberList: gameWithMember.map(value => { return { memberNo: value.memberNo, memberName: value.memberName, attendYn: value.gameMemberNo > 0 ? 1 : 0 }})
  }
}

export async function createGame(ctx: Context, param: GameParam) {
  ctx.log.info('*** Create Game Service Start ***')

  let result = 0

  const { gameNo, memberNoList, ...createParam } = param
  const okaPoint = (param.returnScore - param.startScore) * param.gameMemberCount / 1000

  const createResult = await access.createGame({ ...createParam, okaPoint: okaPoint })
  result = createResult.insertId
  const now = getMysqlDatetime()

  if (result > 0) await access.createGameMemberMap(memberNoList.map(value => { return [result, value, now, now] }))
  return result
}

export async function updateGame(ctx: Context, param: GameParam) {
  ctx.log.info('*** Update Game Service Start ***')

  const result = await access.updateGame(param)

  if (result && result.affectedRows > 0) {
    const deleteResult = await access.deleteGameMemberMap(param.gameNo)
    const now = getMysqlDatetime()
    if (deleteResult && param.memberNoList.length > 0) await access.createGameMemberMap(param.memberNoList.map(value => { return [param.gameNo, value, now, now] }))
  }
  return result.affectedRows
}

export async function updateGameMemberMap(ctx: Context, param: GameMemberParam) {
  ctx.log.info('*** Update Game Member Map Service Start ***')

  const result = await access.updateGameMemberMap({ ...param, rank: 0, point: 0 })
  if (result) {
    const updateParams: UpdateGameMemberMapParam[] = []

    const gameMemberMapData = await access.findGameMemberMapListForUpdate(param.gameNo)
    gameMemberMapData.forEach((map, idx) => {
      const rank = idx + 1
      const okaPoint = rank === 1 ? map.okaPoint : 0
      let umaPoint = 0
      switch (idx) {
        case 0:
          umaPoint = map.gameMemberCount === 4 ? map.umaPoint * 2 : map.umaPoint
          break
        case 1:
          umaPoint = map.gameMemberCount === 4 ? map.umaPoint : 0
          break
        case 2:
          umaPoint = map.gameMemberCount === 4 ? -map.umaPoint : -map.umaPoint
          break
        case 3:
          umaPoint = map.gameMemberCount === 4 ? -map.umaPoint * 2 : 0
          break
      }
      const point = (map.score - map.returnScore) / 1000 + okaPoint + umaPoint

      const updateParam: UpdateGameMemberMapParam = {
        gameNo: map.gameNo,
        memberNo: map.memberNo,
        position: map.position,
        score: map.score,
        rank: rank,
        point: point
      }
      updateParams.push(updateParam)
    })

    if (updateParams.length > 0) for (const param of updateParams) await access.updateGameMemberMap(param)
  }

  return result.affectedRows ?? 0
}

export async function findRankList(ctx: Context, filter: FindRankFilter): Promise<RankList[]> {
  ctx.log.info('*** Find Rank List Service Start ***')

  let list: RankList[] = []

  const countData = await access.findRankCount(filter)

  if (countData.length > 0 && countData[0]['count(*)']) {
    const rankData = await access.findRankList(filter)
    rankData.forEach((value, idx) => {
      const rank = idx + 1
      const rankRate = (value.winCnt + value.secondCnt * 2 + value.thirdCnt * 3 + value.forthCnt * 4) / value.totalGameCnt
      const rankList: RankList = {
        ...value,
        rank: rank,
        avgPoint: Math.round(value.totalPoint / value.totalGameCnt * 100) / 100,
        winRate: Math.round(value.winCnt / value.totalGameCnt * 1000) / 10,
        upRate: Math.round((value.winCnt + value.secondCnt) / value.totalGameCnt * 1000) / 10,
        forthRate: Math.round(value.forthCnt / value.totalGameCnt * 1000) / 10,
        rankRate: Math.round(rankRate * 100) / 100
      }
      list.push(rankList)
    })
  }

  return list
}

export async function login(ctx: Context, param: LoginParam): Promise<LoginInfo> {
  ctx.log.info('*** Login Service Start ***')

  const result: LoginInfo = {
      status: false,
      message: '',
      token: ''
  }

  if (param.userId === 'admin' && param.password === '601') {
    try {
      result.status = true
      result.message = 'Login Success!!!'
      result.token = await jwt.createToken()

    } catch (e) {
      ctx.log.error(String(e))
      result.message = 'Login Failed!!!'
    }
  } else {
    result.message = '일치하는 정보가 없습니다.'
  }

  return result
}
