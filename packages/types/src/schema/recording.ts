import { IMatch, Position } from "./index";

export type IRecording = {
  match: IMatch,
  gameId: string,
  length: number,
  createdAt: Date,
  champion: string,
  position: Position,
  size: number
}