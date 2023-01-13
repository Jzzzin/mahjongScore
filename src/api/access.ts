import * as MahjongScore from '../database/mahjong_score'
import { DB_MAHJONG_SCORE } from '../database'
import {
    FindGameFilter,
    FindMeetFilter,
    FindMemberFilter,
    FindRankFilter,
    GameData,
    GameMemberMapData, GameMemberParam,
    GameParam,
    MeetData,
    MeetMemberMapData,
    MeetParam,
    MemberData,
    MemberParam,
    RankData
} from './typeDef'
import {
  CountData,
  getSearchQuery,
  getSortQuery,
  isEmpty
} from './util'
import * as CONST from './const'

export async function findMemberCount(filter:FindMemberFilter): Promise<CountData[]> {
  const search = getSearchQuery(filter)

  const sql = `
    SELECT count(*)
    FROM member
    WHERE use_yn = '1'
    ${search && `AND ${search}`}
  `
  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as CountData[]
}

export async function findMemberList(filter:FindMemberFilter): Promise<MemberData[]> {
  if (!filter.order_by && !filter.is_desc) filter.is_desc = 'N'

  const search = getSearchQuery(filter)
  const sort = getSortQuery(filter, 'member_no')

  const sql = `
    SELECT member_no                    AS memberNo,
           member_name                  AS memberName,
           use_yn                       AS useYn,
           CAST(created_date AS CHAR)   AS createdDate
    FROM member
    WHERE use_yn = '1'
    ${search && `AND ${search}`}
    ${sort}
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as MemberData[]
}

export async function findMember(memberNo: number): Promise<MemberData> {
  const sql = `
    SELECT member_no                    AS memberNo,
           member_name                  AS memberName,
           use_yn                       AS useYn,
           CAST(created_date AS CHAR)   AS createdDate
    FROM member
    WHERE member_no = '${memberNo}'
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  const result = data as MemberData[]
  return result[0]
}

interface MemberDataForValidate {
  memberNo: number
}

export async function findMemberForValidate(memberName: string): Promise<number> {
  const sql = `
    SELECT member_no AS memberNo
    FROM member
    WHERE member_name = '${memberName}'
    LIMIT 1
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  const result = data as MemberDataForValidate[]
  return result.pop()?.memberNo ?? 0
}

type MemberName =
| 'memberName'
export type CreateMemberParam = Pick<MahjongScore.member, MemberName>
export async function createMember(param: CreateMemberParam): Promise<any> {
  const sql = `
    INSERT INTO member (member_name, created_date, modified_date)
    VALUES (?, now(), now())
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql, Object.values(param))
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateMember(param: MemberParam): Promise<any> {
  const sql = `
    UPDATE member
    SET member_name = '${param.memberName}',
        use_yn = '${param.useYn}',
        modified_date = now()
    WHERE member_no = '${param.memberNo}'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

function getSearchMeetParam(filter: FindMeetFilter, search: string): string {
    const searchEndYn = !isEmpty(filter.endYn) ? `end_yn = '${filter.endYn}'` : ''

    let result = ''
    for (const value of [searchEndYn, search]) {
        if (!isEmpty(result) && !isEmpty(value)) result += ' AND '
        result += value
    }
    return result
}

export async function findMeetCount(filter:FindMeetFilter): Promise<CountData[]> {
  const search = getSearchQuery(filter)
  const searchParam = getSearchMeetParam(filter, search)

  const sql = `
    SELECT count(*)
    FROM meet
    ${searchParam && `WHERE ${searchParam}`}
  `
  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as CountData[]
}

export async function findMeetList(filter:FindMeetFilter): Promise<MeetData[]> {
  if (!filter.order_by && !filter.is_desc) filter.is_desc = 'Y'

  const search = getSearchQuery(filter)
  const searchParam = getSearchMeetParam(filter, search)
  const sort = getSortQuery(filter, 'meet_day')

  const sql = `
    SELECT meet_no                  AS meetNo,
           CAST(meet_day AS CHAR)   AS meetDay,
           CAST(meet_time AS CHAR)  AS meetTime,
           location                 AS location,
           end_yn                   AS endYn
    FROM meet
    ${searchParam && `WHERE ${searchParam}`}
    ${sort}
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as MeetData[]
}

export async function findMeetMemberMapList(): Promise<MeetMemberMapData[]> {
  const sql = `
    SELECT map.meet_no                  AS meetNo,
           map.member_no                AS memberNo,
           member.member_name           AS memberName,
           map.attend_yn                AS attendYn
    FROM meet_member_map map
        LEFT JOIN member member ON map.member_no = member.member_no
    WHERE map.attend_yn = '1'
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as MeetMemberMapData[]
}

export interface MeetWithMember extends MeetData {
  memberNo: number
  memberName: string
  attendYn: number
}

export async function findMeetWithMember(meetNo: number): Promise<MeetWithMember[]> {
  const sql = `
    SELECT meet.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(meet.meet_time AS CHAR)     AS meetTime,
           meet.location                    AS location,
           meet.end_yn                      AS endYn,
           map.member_no                    AS memberNo,
           member.member_name               AS memberName,
           map.attend_yn                    AS attendYn
    FROM meet meet
        LEFT JOIN meet_member_map map ON meet.meet_no = map.meet_no
        LEFT JOIN member member ON map.member_no = member.member_no
    WHERE meet.meet_no = '${meetNo}'
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as MeetWithMember[]
}

interface MeetDataForValidate {
  meetNo: number
}

export async function findMeetForValidate(meetDay: string): Promise<number> {
  const sql = `
    SELECT meet_no AS meetNo
    FROM meet
    WHERE meet_day = '${meetDay}'
    LIMIT 1
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  const result = data as MeetDataForValidate[]
  return result.pop()?.meetNo ?? 0
}

type MeetName =
| 'meetDay'
| 'meetTime'
| 'location'
export type CreateMeetParam = Pick<MahjongScore.meet, MeetName>
export async function createMeet(param: CreateMeetParam): Promise<any> {
  const sql = `
    INSERT INTO meet (meet_day, meet_time, location, created_date, modified_date)
    VALUES (?, ?, ?, now(), now())
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql, Object.values(param))
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function createMeetMemberMap(meetNo: number): Promise<any> {
  const sql = `
    INSERT INTO meet_member_map (meet_no, member_no, created_date, modified_date)
    SELECT '${meetNo}', member_no, now(), now() FROM member WHERE use_yn = '1'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

interface UpdateMeetMemberMapParam {
  meetNo: number
  memberNoList: number[]
}

export async function updateMeetMemberMap(param: UpdateMeetMemberMapParam): Promise<any> {
  const searchParam = param.memberNoList.map(i => `'${i}'`).join(',') ?? '0'
  const sql = `
    UPDATE meet_member_map
    SET attend_yn = 0,
        modified_date = now()
    WHERE meet_no = '${param.meetNo}';
    UPDATE meet_member_map
    SET attend_yn = 1,
        modified_date = now()
    WHERE meet_no = '${param.meetNo}'
      AND member_no IN ( ${searchParam} );
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateMeet(param: MeetParam): Promise<any> {
  const sql = `
    UPDATE meet
    SET meet_day = '${param.meetDay}',
        meet_time = '${param.meetTime}',
        location = '${param.location}',
        end_yn = '${param.endYn}',
        modified_date = now()
    WHERE meet_no = '${param.meetNo}'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function findGameCount(filter:FindGameFilter): Promise<CountData[]> {
  const search = getSearchQuery(filter)

  const sql = `
    SELECT count(*)
    FROM game game
        LEFT JOIN meet meet ON game.meet_no = meet.meet_no
    ${search && `WHERE ${search}`}
  `
  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as CountData[]
}

export async function findGameList(filter:FindGameFilter): Promise<GameData[]> {
  if (!filter.order_by && !filter.is_desc) filter.is_desc = 'Y'

  const search = getSearchQuery(filter)
  const sort = getSortQuery(filter, 'game.game_number')

  const sql = `
    SELECT game.game_no                     AS gameNo,
           game.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(game.game_number AS CHAR)   AS gameNumber,
           game.game_member_count           AS gameMemberCount,
           game.game_type                   AS gameType,
           game.start_score                 AS startScore,
           game.return_score                AS returnScore,
           game.oka_point                   AS okaPoint,
           game.uma_point                   AS umaPoint,
           game.end_yn                      AS endYn
    FROM game game
        LEFT JOIN meet meet ON game.meet_no = meet.meet_no
    ${search && `WHERE ${search}`}
    ${sort}
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as GameData[]
}

export async function findGameMemberMapList(): Promise<GameMemberMapData[]> {
  const sql = `
    SELECT map.game_no                  AS gameNo,
           map.member_no                AS memberNo,
           member.member_name           AS memberName,
           map.position                 AS position,
           map.score                    AS score,
           map.rank                     AS rank,
           map.point                    AS point
    FROM game_member_map map
        LEFT JOIN member member ON map.member_no = member.member_no
    ORDER BY map.game_no, map.score DESC
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as GameMemberMapData[]
}

export interface GameWithMember extends GameData {
  memberNo: number
  memberName: string
  gameMemberNo: number
}

export async function findGameWithMember(gameNo: number): Promise<GameWithMember[]> {
  const sql = `
    SELECT game.game_no                     AS gameNo,
           game.meet_no                     AS meetNo,
           CAST(meet.meet_day AS CHAR)      AS meetDay,
           CAST(game.game_number AS CHAR)   AS gameNumber,
           game.game_member_count           AS gameMemberCount,
           game.game_type                   AS gameType,
           game.start_score                 AS startScore,
           game.return_score                AS returnScore,
           game.oka_point                   AS okaPoint,
           game.uma_point                   AS umaPoint,
           game.end_yn                      AS endYn,
           meetMap.member_no                AS memberNo,
           member.member_name               AS memberName,
           IFNULL(gameMap.member_no, 0)     AS gameMemberNo
    FROM game game
        LEFT JOIN meet meet ON game.meet_no = meet.meet_no
        LEFT JOIN meet_member_map meetMap ON game.meet_no = meetMap.meet_no AND meetMap.attend_yn = '1'
        LEFT JOIN game_member_map gameMap ON game.game_no = gameMap.game_no AND meetMap.member_no = gameMap.member_no
        LEFT JOIN member member ON meetMap.member_no = member.member_no
    WHERE game.game_no = '${gameNo}'
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as GameWithMember[]
}

type GameName =
| 'meetNo'
| 'gameNumber'
| 'gameMemberCount'
| 'gameType'
| 'startScore'
| 'returnScore'
| 'umaPoint'
| 'okaPoint'
export type CreateGameParam = Pick<MahjongScore.game, GameName>
export async function createGame(param: CreateGameParam): Promise<any> {
  const sql = `
    INSERT INTO game (meet_no, game_number, game_member_count, game_type, start_score, return_score, uma_point, oka_point, created_date, modified_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, now(), now())
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql, Object.values(param))
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function deleteGameMemberMap(gameNo: number): Promise<any> {
  const sql = `
    DELETE FROM game_member_map
    WHERE game_no = '${gameNo}'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

type GameMemberMapName =
| 'gameNo'
| 'memberNo'
| 'createdDate'
| 'modifiedDate'
export type CreateGameMemberMapParam = Array<MahjongScore.game_member_map[GameMemberMapName]>
export async function createGameMemberMap(params: CreateGameMemberMapParam[]): Promise<any> {
  const sql = `
    INSERT INTO game_member_map (game_no, member_no, created_date, modified_date)
    VALUES ?
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql, [params])
    return rows
  } catch (e) {
    console.log(e)
  }
}

export async function updateGame(param: GameParam): Promise<any> {
  const sql = `
    UPDATE game
    SET meet_no = '${param.meetNo}',
        game_number = '${param.gameNumber}',
        game_member_count = '${param.gameMemberCount}',
        game_type = '${param.gameType}',
        start_score = '${param.startScore}',
        return_score = '${param.returnScore}',
        oka_point = (${param.returnScore} - ${param.startScore}) * ${param.gameMemberCount} / 1000,
        uma_point = '${param.umaPoint}',
        modified_date = now()
    WHERE game_no = '${param.gameNo}'
      AND end_yn = '0'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

export interface UpdateGameMemberMapParam extends GameMemberParam {
  rank: number
  point: number
}

export async function updateGameMemberMap(param: UpdateGameMemberMapParam): Promise<any> {
  const sql = `
    UPDATE game_member_map map
        LEFT JOIN game game ON map.game_no = game.game_no
    SET map.position = '${param.position}',
        map.score = '${param.score}',
        map.rank = '${param.rank}',
        map.point = '${param.point}',
        map.modified_date = now(),
        game.end_yn = '1',
        game.modified_date = now()
    WHERE map.game_no = '${param.gameNo}'
      AND map.member_no = '${param.memberNo}'
  `
  console.log(sql)

  try {
    const [rows] = await DB_MAHJONG_SCORE.query(sql)
    return rows
  } catch (e) {
    console.log(e)
  }
}

export interface GameMemberMapForUpdate {
  gameNo: number
  memberNo: number
  position: string
  score: number
  returnScore: number
  okaPoint: number
  umaPoint: number
}

export async function findGameMemberMapListForUpdate(gameNo: number): Promise<GameMemberMapForUpdate[]> {
  const sql = `
    SELECT game.game_no         AS gameNo,
           map.member_no        AS memberNo,
           map.position         AS position,
           map.score            AS score,
           game.return_score    AS returnScore,
           game.oka_point       AS okaPoint,
           game.uma_point       AS umaPoint
    FROM game game
        LEFT JOIN game_member_map map ON game.game_no = map.game_no
    WHERE game.game_no = '${gameNo}'
    ORDER BY game.game_no, map.score DESC
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as GameMemberMapForUpdate[]
}

function getSearchRankParam(filter: FindRankFilter, search: string): string {
  const searchDate = (filter.dateType !== CONST.DATE_TYPE.ALL && !isEmpty(filter.startDate) && !isEmpty(filter.endDate)) ? `meet.meet_day >= '${filter.startDate}' AND meet.meet_day <= '${filter.endDate}'` : ''

  let result = ''
  for (const value of [searchDate, search]) {
    if (!isEmpty(result) && !isEmpty(value)) result += ' AND '
    result += value
  }
  return result
}

export async function findRankCount(filter:FindRankFilter): Promise<CountData[]> {
    const search = getSearchQuery(filter)
    const searchParam = getSearchRankParam(filter, search)

    const sql = `
    SELECT count(*)
    FROM ( SELECT member.member_name                   AS memberName,
                  SUM(map.point)                       AS totalPoint,
                  COUNT(IF(map.rank=1, true, null))    AS winCnt,
                  COUNT(IF(map.rank=2, true, null))    AS secondCnt,
                  COUNT(IF(map.rank=3, true, null))    AS thirdCnt,
                  COUNT(IF(map.rank=4, true, null))    AS forthCnt,
                  COUNT(map.game_no)                   AS totalGameCnt
           FROM game_member_map map
               LEFT JOIN game game ON game.game_no = map.game_no
               LEFT JOIN meet meet ON meet.meet_no = game.meet_no
               LEFT JOIN member member ON member.member_no = map.member_no
           WHERE game.end_yn = '1'
           ${searchParam && `AND ${searchParam}`}
           GROUP BY map.member_no
         ) stat
  `
    const [data] = await DB_MAHJONG_SCORE.query(sql)
    return data as CountData[]
}

export async function findRankList(filter:FindRankFilter): Promise<RankData[]> {
  if (!filter.order_by && !filter.is_desc) filter.is_desc = 'Y'

  const search = getSearchQuery(filter)
  const searchParam = getSearchRankParam(filter, search)
  const sort = getSortQuery(filter, 'totalPoint')

  const sql = `
    SELECT member.member_name                   AS memberName,
           SUM(map.point)                       AS totalPoint,
           COUNT(IF(map.rank=1, true, null))    AS winCnt,
           COUNT(IF(map.rank=2, true, null))    AS secondCnt,
           COUNT(IF(map.rank=3, true, null))    AS thirdCnt,
           COUNT(IF(map.rank=4, true, null))    AS forthCnt,
           COUNT(map.game_no)                   AS totalGameCnt
    FROM game_member_map map
        LEFT JOIN game game ON game.game_no = map.game_no
        LEFT JOIN meet meet ON meet.meet_no = game.meet_no
        LEFT JOIN member member ON member.member_no = map.member_no
    WHERE game.end_yn = '1'
    ${searchParam && `AND ${searchParam}`}
    GROUP BY map.member_no
    ${sort}
  `
  console.log(sql)

  const [data] = await DB_MAHJONG_SCORE.query(sql)
  return data as RankData[]
}