import { Types } from "mongoose";
import { GameMode, GameType, IFrame, Team, IParticipant } from "./index";
import { QueueType } from "./enums";

export type IMatch = {
  _id: Types.ObjectId,
  gameId: string,
  queueId: QueueType,
  start: number,
  finish: number,
  patch: string
  mode: GameMode,
  type: GameType,
  winningTeam: Team,
  participants: IParticipant[],
  frames: IFrame[]
}