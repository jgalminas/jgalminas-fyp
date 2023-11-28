import mongoose from "mongoose";
import { Schema } from "../db";
import { IParticipantItem, IRune, Position, SummonerSpell, Team } from "./index";
import { POSITION, SUMMONER_SPELL, TEAM } from "./enums";
import { ParticipantItemSchema } from "./participantItem";

export type IParticipant = {
  puuid: string,
  participantId: number,
  team: Team,
  championId: number,
  position: Position,
  summonerOne: SummonerSpell,
  summonerTwo: SummonerSpell,
  primaryRune: IRune,
  secondaryRune: IRune,
  items: IParticipantItem[],
  bannedChampionId: number
} & Document

const ParticipantSchema = new Schema<IParticipant>({
  puuid: { type: String, required: true },
  participantId: { type: Number, required: true },
  team: { type: String, enum: TEAM, required: true },
  championId: { type: Number, required: true },
  position: { type: String, enum: POSITION, required: true },
  summonerOne: { type: Number, enum: SUMMONER_SPELL, required: true },
  summonerTwo: { type: Number, enum: SUMMONER_SPELL, required: true },
  primaryRune: { type: Number, required: true },
  secondaryRune: { type: Number, required: true },
  items: [{ type: ParticipantItemSchema, required: true }],
  bannedChampionId: { type: Number, required: true }
});

export const Participant = mongoose.model<IParticipant>('Participant', ParticipantSchema);