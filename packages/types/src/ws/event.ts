import { IMatch, IRecording } from "../index"

export type WebSocketEvent = {
  type: 'MATCH_UPLOADED',
  payload: {
    match: IMatch,
    recording: IRecording | null
  }
}