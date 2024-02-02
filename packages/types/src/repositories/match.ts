import { Types } from "mongoose"
import { IMatch, IParticipantStats } from "../index"

export type Match = Omit<IMatch, 'frames'> & {
  participantStats: IParticipantStats[]
}

export type MatchWithGoldFrames = Omit<IMatch, 'frames' | 'bans'> & {
  frames: {
    blueGold: number,
    redGold: number,
    frameId: Types.ObjectId,
    timestamp: number
  }[]
}