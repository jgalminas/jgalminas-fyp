import { Types } from "mongoose";
import { IMatch, Position, QueueType } from "./index";

export type IRecording = {
  _id: Types.ObjectId,
  match: IMatch,
  gameId: string,
  length: number,
  createdAt: Date,
  champion: string,
  position?: Position,
  queueId: QueueType,
  size: number
}