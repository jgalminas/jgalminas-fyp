import { Types } from "mongoose";
import { IMatch, Position, QueueType } from "./index";

export type IHighlight = {
  _id: Types.ObjectId,
  match: IMatch,
  fileId: string,
  length: number,
  createdAt: Date,
  champion: string,
  position: Position,
  size: number,
  queueId: QueueType,
  publicUrl?: string,
  tags: string[]
}

