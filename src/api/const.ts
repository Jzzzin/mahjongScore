export const LOG_LEVEL = {
  INFO: 'INFO',
  WARN: 'WARN',
  DEBUG: 'DEBUG',
  ERROR: 'ERROR'
} as const
export type LogLevel = typeof LOG_LEVEL[keyof typeof LOG_LEVEL]

export const WEEKDAY = {
  MON: 'MON',
  TUE: 'TUE',
  WED: 'WED',
  THU: 'THU',
  FRI: 'FRI',
  SAT: 'SAT',
  SUN: 'SUN'
} as const

export const PATHNAME = {
  Login: '/api/login'
} as const

export const GAME_MEMBER_COUNT = {
  3: 3,
  4: 4
} as const
export type GameMemberCount = typeof GAME_MEMBER_COUNT[keyof typeof GAME_MEMBER_COUNT]

export const GAME_TYPE = {
  HALF: 'HALF',
  EAST: 'EAST'
} as const
export type GameType = typeof GAME_TYPE[keyof typeof GAME_TYPE]

export const START_SCORE = {
  3: 25000,
  4: 35000
} as const

export const RETURN_SCORE = {
  3: 30000,
  4: 40000
} as const

export const UMA_POINT = {
  HALF: 10,
  EAST: 5
} as const
