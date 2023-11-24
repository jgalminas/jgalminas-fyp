import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import { IParticipant } from "./index";

export type IParticipantStats = {
  participant: IParticipant,
  level: number,
  jungleMinionsKilled: number,
  minionsKilled: number,
  totalGold: number,
  magicDamageDone: number,
  magicDamageToChampions: number,
  magicDamageTaken: number,
  physicalDamageDone: number,
  physicalDamageToChampions: number,
  physicalDamageTaken: number,
  trueDamageDone: number,
  trueDamageToChampions: number,
  trueDamageTaken: number
} & Document

const ParticipantStatsSchema = new Schema<IParticipantStats>({
  participant: { type: ObjectId, ref: 'Participant', required: true },
  level: { type: Number, required: true },
  jungleMinionsKilled: { type: Number, required: true },
  minionsKilled: { type: Number, required: true },
  totalGold: { type: Number, required: true },
  magicDamageDone: { type: Number, required: true },
  magicDamageToChampions: { type: Number, required: true },
  magicDamageTaken: { type: Number, required: true },
  physicalDamageDone: { type: Number, required: true },
  physicalDamageToChampions: { type: Number, required: true },
  physicalDamageTaken: { type: Number, required: true },
  trueDamageDone: { type: Number, required: true },
  trueDamageToChampions: { type: Number, required: true },
  trueDamageTaken: { type: Number, required: true }
});

export const ParticipantStats = mongoose.model<IParticipantStats>('ParticipantStats', ParticipantStatsSchema);