import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import { GAME_MODE, GAME_TYPE, IMatch, QUEUE, TEAM } from "@fyp/types";

const MatchSchema = new Schema<IMatch>({
  gameId: { type: String, required: true, index: true, unique: true },
  queueId: { type: Number, enum: QUEUE, required: true },
  start: { type: Number, required: true },
  finish: { type: Number, required: true },
  patch: { type: String, required: true },
  mode: { type: String, required: true, enum: GAME_MODE },
  type: { type: String, required: true, enum: GAME_TYPE },
  winningTeam: { type: String, required: true, enum: TEAM },
  participants: [{ type: ObjectId, ref: 'Participant', required: true }],
  frames: [{ type: ObjectId, ref: 'Frame', required: true }]
});

export const Match = mongoose.model<IMatch>('Match', MatchSchema);