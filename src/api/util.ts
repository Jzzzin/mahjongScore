import { v4 as uuidv4 } from 'uuid'
import {ParsedUrlQuery} from "querystring"
import * as CONST from './const'

export interface Filter<T extends string> extends ParsedUrlQuery {
    [key: string]: string | string[] | undefined
    companyNo?: string
    limit?: string
    offset?: string
    order_by?: T
    is_desc?: 'Y' | 'N'
    search_type?: T
    search_keyword?: string
}

export interface CountData {
  'count(*)': number
}

export interface File {
  size: number
  path: string
  name: string | null
  type: string | null
  lastModifiedDate?: Date | null
  hash?: string | 'sha1' | 'md5' | 'sha256' | null
}

export function getLimitQuery<T extends string>({ limit, offset }: Filter<T>, defaultLimit = 50): string {
  return `
    limit ${limit ?? defaultLimit}
    offset ${offset ?? 0}
  `
}

export function getSortQuery<T extends string>({ order_by, is_desc }: Filter<T>, defaultColumn: T): string {
  const column = order_by ?? defaultColumn
  if (column) return `order by ${column}${is_desc === 'Y' ? ' desc' : ''}`
  else return ''
}

export function getSearchQuery<T extends string>({ search_type, search_keyword }: Filter<T>): string {
  if (!search_type || !search_keyword) return ''
  else return `${search_type} like "%${search_keyword}%"`
}

export function getRanStr(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''
  if (!length) length = 6

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

export function isEmpty(value: any): boolean {
  return value === '' || value === null || value === undefined || (typeof value === 'string' && value.toUpperCase() === 'NULL') || (Array.isArray(value) && !value.length) || (typeof value === 'object' && !Object.keys(value).length)
}

export function fillZero(width: number, str: string) {
  return str.length >= width ? str : (new Array(width - str.toString().length + 1).join('0')).toString() + str
}

export function getDateRange(startDate: string, endDate: string): string[] {
  const parseStartDate = `${startDate.substr(0, 4)}-${startDate.substr(4, 2)}-${startDate.substr(6, 2)}`
  const parseEndDate = `${endDate.substr(0, 4)}-${endDate.substr(4, 2)}-${endDate.substr(6, 2)}`
  const dateList: string[] = []
  const dateMove = new Date(parseStartDate)
  let strDate = parseStartDate

  if (startDate === endDate) dateList.push(parseStartDate)
  else {
    while (strDate < parseEndDate) {
      strDate = dateMove.toISOString().slice(0, 10)
      dateList.push(strDate)
      dateMove.setDate(dateMove.getDate() + 1)
    }
  }
  return dateList
}

export async function delay(ms: number) {
  return await new Promise(resolve => setTimeout(resolve, ms))
}

export function getDate(dateString: string): Date {
  const year = dateString.substr(0, 4)
  const month = dateString.substr(4, 2)
  const day = dateString.substr(6, 2)
  if (dateString.length === 8) {
    return new Date(Number(year), Number(month) - 1, Number(day))
  } else if (dateString.length === 12) {
    const hour = dateString.substr(8, 2)
    const minute = dateString.substr(10, 2)
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute))
  } else if (dateString.length === 14) {
    const hour = dateString.substr(8, 2)
    const minute = dateString.substr(10, 2)
    const second = dateString.substr(12, 2)
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute), Number(second))
  } else {
    return new Date()
  }
}

export function getDateBetween(startDateStr: string, endDateStr: string): number {
  const startDate = getDate(startDateStr).getTime()
  const endDate = getDate(endDateStr).getTime()
  return (endDate - startDate) / (1000 * 60 * 60 * 24)
}

export function getMysqlDatetime(timestamp?: number) {
  const time = timestamp ? new Date(timestamp) : new Date()
  const isoTime = new Date((new Date(time)).toISOString())
  const fixedTime = new Date(isoTime.getTime() - (time.getTimezoneOffset() * 60000))
  return fixedTime.toISOString().slice(0, 19).replace('T', ' ')
}

export function getLocaleDateString(date: Date) {
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/[^0-9]/g, '')
}

export function getLocaleTimeString(date: Date, length?: number) {
  if (length === 4) return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit' }).replace(/[^0-9]/g, '')
  else return date.toLocaleTimeString('ko-KR', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/[^0-9]/g, '')
}

export function getJapaneseDateString(dateString: string): string {
  const dateNumber = Number(dateString)
  const year = Number(dateString.substr(0, 4))
  const month = Number(dateString.substr(4, 2))
  const day = Number(dateString.substr(6, 2))
  if (dateString.length === 8) {
    let label
    let localYear
    // 明治５年以降のみ
    if (year < 1873) {
      label = ''
      localYear = year
    } else if (dateNumber >= 20190501) {
      label = '令和'
      localYear = year - 2019 + 1
    } else if (dateNumber >= 19890108) {
      label = '平成'
      localYear = year - 1988
    } else if (dateNumber >= 19261225) {
      label = '昭和'
      localYear = year - 1925
    } else if (dateNumber >= 19120730) {
      label = '大正'
      localYear = year - 1911
    } else {
      label = '明治'
      localYear = year - 1868
    }

    // 1年は元年
    const wareki = (localYear === 1) ? label + '元年' : label + String(localYear) + '年'

    return wareki + String(month) + '月' + String(day) + '日'
  } else {
    return 'Invalid dateString'
  }
}

export function concatStr(orgStr: string, addStr: string): string {
  return isEmpty(orgStr)
    ? addStr
    : orgStr.concat('\\n', addStr)
}

export function uuid(): string {
  const tokens = uuidv4().split('-')
  return tokens[2].concat(tokens[1], tokens[0], tokens[3], tokens[4])
}

export function getWeekday(str: string): string | undefined {
  let result
  switch (str) {
    case CONST.WEEKDAY.MON:
      result = '0'
      break
    case CONST.WEEKDAY.TUE:
      result = '1'
      break
    case CONST.WEEKDAY.WED:
      result = '2'
      break
    case CONST.WEEKDAY.THU:
      result = '3'
      break
    case CONST.WEEKDAY.FRI:
      result = '4'
      break
    case CONST.WEEKDAY.SAT:
      result = '5'
      break
    case CONST.WEEKDAY.SUN:
      result = '6'
      break
  }
  return result
}

export function getWeekdayKor(day: number): string {
  const weekDay = ['일', '월', '화', '수', '목', '금', '토', '일']
  return weekDay[day]
}

export function getSundayFromWeekNum(year: number, weekNum: number): string {
  const sunday = new Date(year, 0, (1 + weekNum * 7))
  while (sunday.getDay() !== 0) {
    sunday.setDate(sunday.getDate() - 1)
  }
  const dateString = getLocaleDateString(sunday)
  return dateString.substr(0, 4) + '-' + dateString.substr(4, 2) + '-' + dateString.substr(6, 2) + '(일)~'
}
