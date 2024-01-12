import { IMatch, IParticipantStats } from "../index"

export type Match = Omit<IMatch, 'frames'> & {
  participantStats: IParticipantStats[]
}