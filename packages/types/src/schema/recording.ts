import { IMatch, Position, QueueType } from "./index";

export type IRecording = {
  match: IMatch,
  gameId: string,
  length: number,
  createdAt: Date,
  champion: string,
  position?: Position,
  queueId: QueueType,
  size: number
}