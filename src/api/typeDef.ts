import { Filter } from './util'

type FindMemberFilterName = ''
export interface FindMemberFilter extends Filter<FindMemberFilterName> {
}

export interface MemberData {
  memberNo: number
  memberName: string
  useYn: number
  createdDate: string
}

export interface MemberParam {
  memberNo: number
  memberName: string
  useYn: number
}

type FindMeetFilterName = ''
export interface FindMeetFilter extends Filter<FindMeetFilterName> {
  endYn: string
}

export interface MeetData {
  meetNo: number
  meetDay: string
  meetTime: string
  location: string
  endYn: number
}

export interface MeetMemberMapData {
  meetNo: number
  memberNo: number
  memberName: string
  attendYn: number
}

export interface MeetList extends MeetData {
  memberList: MeetMemberMapData[]
}

export interface MeetParam {
  meetNo: number
  meetDay: string
  meetTime: string
  location: string
  endYn: number
  memberNoList: number[]
}

type FindGameFilterName = ''
export interface FindGameFilter extends Filter<FindGameFilterName> {
}

export interface GameData {
  gameNo: number
  meetNo: number
  meetDay: string
  gameNumber: string
  gameMemberCount: number
  gameType: string
  startScore: number
  returnScore: number
  okaPoint: number
  umaPoint: number
  endYn: number
}

export interface GameMemberMapData {
  gameNo: number
  memberNo: number
  memberName: string
  position: string
  score: number
  rank: number
  point: number
}

export interface GameList extends GameData {
  memberList: GameMemberMapData[]
}

interface GameDetailMember {
  memberNo: number
  memberName: string
  attendYn: number
}

export interface GameDetail extends GameData {
  memberList: GameDetailMember[]
}

export interface GameParam {
  gameNo: number
  meetNo: number
  gameNumber: string
  gameMemberCount: number
  gameType: string
  startScore: number
  returnScore: number
  umaPoint: number
  memberNoList: number[]
}

export interface GameMemberParam {
  gameNo: number
  memberNo: number
  position: string
  score: number
}

type FindRankFilterName = ''
export interface FindRankFilter extends Filter<FindRankFilterName> {
  dateType: string
  startDate: string
  endDate: string
}

export interface RankData {
  memberName: string
  totalPoint: number
  winCnt: number
  secondCnt: number
  thirdCnt: number
  forthCnt: number
  totalGameCnt: number
}

export interface RankList extends RankData {
  rank: number
  avgPoint: number
  winRate: number
  upRate: number
  forthRate: number
  rankRate: number
}

export interface LoginParam {
  userId: string
  password: string
}

export interface LoginInfo {
  status: boolean
  message: string
  token: string
}
