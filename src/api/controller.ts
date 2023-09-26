import type { Middleware } from 'koa'
import {
    FindGameFilter,
    FindMeetFilter,
    FindMemberFilter, FindPointRankFilter, FindRankFilter, GameMemberParam, GameParam, LoginParam, MeetParam, MemberParam
} from './typeDef'
import * as service from './service'

export const findMemberList: Middleware = async (ctx) => {
  ctx.log.info('*** Find Member List Controller Start ***')

  const query = ctx.query as FindMemberFilter
  ctx.body = await service.findMemberList(ctx, query)
}

export const findMember: Middleware = async (ctx) => {
  ctx.log.info('*** Find Member Controller Start ***')

  const { memberNo } = ctx.params
  ctx.body = await service.findMember(ctx, memberNo)
}

export const createMember: Middleware = async (ctx) => {
  ctx.log.info('*** Create Member Controller Start ***')

  const param = ctx.request.body as MemberParam

  try {
    const result = await service.createMember(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.status = 204
      ctx.body = 'Duplicated Member Name'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Create Failed'
  }
}

export const updateMember: Middleware = async (ctx) => {
  ctx.log.info('*** Update Member Controller Start ***')

  const param = ctx.request.body as MemberParam

  try {
    const result = await service.updateMember(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = 'Update Success'
    } else {
      ctx.status = 204
      ctx.body = 'Duplicated Member Name'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Update Failed'
  }
}

export const findMeetList: Middleware = async (ctx) => {
  ctx.log.info('*** Find Meet List Controller Start ***')

  const query = ctx.query as FindMeetFilter
  const data = await service.findMeetList(ctx, query)
  if (data) {
      ctx.status = 200
      ctx.body = data
  } else {
      ctx.status = 204
  }
}

export const findLocationList: Middleware = async (ctx) => {
    ctx.log.info('*** Find Location List Controller Start ***')

    const data = await service.findLocationList(ctx)
    if (data) {
        ctx.status = 200
        ctx.body = data
    } else {
        ctx.status = 204
    }
}

export const findMeet: Middleware = async (ctx) => {
  ctx.log.info('*** Find Meet Controller Start ***')

  const { meetNo } = ctx.params
  ctx.body = await service.findMeet(ctx, meetNo)
}

export const createMeet: Middleware = async (ctx) => {
  ctx.log.info('*** Create Meet Controller Start ***')

  const param = ctx.request.body as MeetParam

  try {
    const result = await service.createMeet(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.status = 204
      ctx.body = 'Create Failed'
     }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Create Failed'
  }
}

export const updateMeet: Middleware = async (ctx) => {
  ctx.log.info('*** Update Meet Controller Start ***')

  const param = ctx.request.body as MeetParam

  try {
    const result = await service.updateMeet(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = 'Update Success'
    } else {
      ctx.status = 204
      ctx.body = 'Update Failed'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Update Failed'
  }
}

export const findGameList: Middleware = async (ctx) => {
  ctx.log.info('*** Find Game List Controller Start ***')

  const query = ctx.query as FindGameFilter
  const data = await service.findGameList(ctx, query)
  if (data) {
    ctx.status = 200
    ctx.body = data
  } else {
    ctx.status = 204
  }
}

export const findGame: Middleware = async (ctx) => {
  ctx.log.info('*** Find Game Controller Start ***')

  const { gameNo } = ctx.params
  ctx.body = await service.findGame(ctx, gameNo)
}

export const createGame: Middleware = async (ctx) => {
  ctx.log.info('*** Create Game Controller Start ***')

  const param = ctx.request.body as GameParam

  try {
    const result = await service.createGame(ctx, param)
    if (result > 0) {
        ctx.status = 200
        ctx.body = result
    } else {
        ctx.status = 204
        ctx.body = 'Create Failed'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Create Failed'
  }
}

export const findMeetForGameList: Middleware = async (ctx) => {
    ctx.log.info('*** Find Meet For Game List  Controller Start ***')

    const query = ctx.query as FindMeetFilter
    query.endYn = '0'
    const data = await service.findMeetList(ctx, query)
    if (data) {
        ctx.status = 200
        ctx.body = data
    } else {
        ctx.status = 204
    }
}

export const updateGame: Middleware = async (ctx) => {
  ctx.log.info('*** Update Game Controller Start ***')

  const param = ctx.request.body as GameParam

  try {
    const result = await service.updateGame(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = 'Update Success'
    } else {
      ctx.status = 204
      ctx.body = 'Update Failed'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Update Failed'
  }
}

export const updateGameMemberMap: Middleware = async (ctx) => {
  ctx.log.info('*** Update Game Member Map Controller Start ***')

  const param = ctx.request.body as GameMemberParam

  try {
    const result = await service.updateGameMemberMap(ctx, param)
    if (result > 0) {
      ctx.status = 200
      ctx.body = result
    } else {
      ctx.status = 204
      ctx.body = 'Create Failed'
    }
  } catch (e) {
    ctx.log.error(String(e))

    ctx.status = 500
    ctx.body = 'Create Failed'
  }
}

export const findRankList: Middleware = async (ctx) => {
  ctx.log.info('*** Find Rank List Controller Start ***')

  const query = ctx.query as FindRankFilter
  const data = await service.findRankList(ctx, query)
  if (data) {
    ctx.status = 200
    ctx.body = data
  } else {
    ctx.status = 204
  }
}

export const findYearList: Middleware = async (ctx) => {
    ctx.log.info('*** Find Year List Controller Start ***')

    const data = await service.findYearList(ctx)
    if (data) {
        ctx.status = 200
        ctx.body = data
    } else {
        ctx.status = 204
    }
}

export const findPointRankList: Middleware = async (ctx) => {
  ctx.log.info('*** Find Point Rank List Controller Start ***')

  const query = ctx.query as FindPointRankFilter
  const data = await service.findPointRankList(ctx, query)
  if (data) {
    ctx.status = 200
    ctx.body = data
  } else {
    ctx.status = 204
  }
}

export const login: Middleware = async (ctx) => {
    ctx.log.info('*** Login Controller Start ***')

    const param = ctx.request.body as LoginParam
    ctx.body = await service.login(ctx, param)
}
