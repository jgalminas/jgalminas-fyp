import mongoose from "mongoose";
import { Schema } from "../db/db";
import { IParticipantStats } from "@fyp/types";

const ParticipantStatsSchema = new Schema<IParticipantStats>({
  participantId: { type: Number, required: true },
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