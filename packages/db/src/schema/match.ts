import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import { GameMode, GameType, IFrame, IHighlight, Team, IParticipant } from "./index";
import { GAME_MODE, GAME_TYPE, TEAM } from "./enums";

export type IMatch = {
  gameId: string,
  start: number,
  finish: number,
  patch: string
  mode: GameMode,
  type: GameType,
  winningTeam: Team,
  highlights: IHighlight[],
  participants: IParticipant[],
  frames: IFrame[]
} & Document

const MatchSchema = new Schema<IMatch>({
  gameId: { type: String, required: true, index: true, unique: true },
  start: { type: Number, required: true },
  finish: { type: Number, required: true },
  patch: { type: String, required: true },
  mode: { type: String, required: true, enum: GAME_MODE },
  type: { type: String, required: true, enum: GAME_TYPE },
  winningTeam: { type: String, required: true, enum: TEAM },
  highlights: [{ type: ObjectId, ref: 'Highlight', required: true }],
  participants: [{ type: ObjectId, ref: 'Participant', required: true }],
  frames: [{ type: ObjectId, ref: 'Frame', required: true }]
});

export const Match = mongoose.model<IMatch>('Match', MatchSchema);