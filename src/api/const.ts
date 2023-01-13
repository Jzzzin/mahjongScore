export const DATE_TYPE = {
  ALL: 'ALL'
} as const

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
