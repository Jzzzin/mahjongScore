interface audit {
  createdDate: String
  createdBy?: string
}

interface auditWithUpdate extends audit {
  modifiedDate: String
}

export interface member extends auditWithUpdate {
  memberNo: number
  memberName: string
  useYn: number
}

export interface meet extends auditWithUpdate {
  meetNo: number
  meetDay: string
  meetTime: string
  location: string
  endYn: number
}

export interface meet_member_map extends auditWithUpdate {
  seq: number
  meetNo: number
  memberNo: number
  attendYn: number
}

export interface game extends auditWithUpdate {
  gameNo: number
  meetNo: number
  gameNumber: string
  gameMemberCount: number
  gameType: string
  startScore: number
  returnScore: number
  okaPoint: number
  umaPoint: number
  comment: string
  endYn: number
}

export interface game_member_map extends auditWithUpdate {
  seq: number
  gameNo: number
  memberNo: number
  position: string
  score: number
  rank: number
  point: number
}
