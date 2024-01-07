import { Types } from "mongoose";
import { Position } from "./index";

export type IHighlight = {
  _id: Types.ObjectId,
  start: number,
  finish: number,
  championId: number,
  position: Position,
  createdAt: Date,
  publicUrl: string | null
}