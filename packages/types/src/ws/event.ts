import { IMatch, IRecording } from "../index"

export type WebSocketEvent = {
  type: 'MATCH_UPLOADED',
  payload: {
    match: IMatch
  }
} | {
  type: 'AI_HIGHLIGHTS',
  payload: {
    recording: IRecording,
    matchDuration: number,
    timeframes: {
      frame: number,
      timestamp: number
    }[]
  }
}