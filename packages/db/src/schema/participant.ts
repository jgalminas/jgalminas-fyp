import mongoose from "mongoose";
import { Schema } from "../db";
import { IParticipantItem, Position, SummonerSpell, Team } from "./index";
import { POSITION, SUMMONER_SPELL, TEAM } from "./enums";
import { ParticipantItemSchema } from "./participantItem";

export type IParticipant = {
  puuid: string,
  participantId: number,
  username: string,
  tag: string,
  team: Team,
  champion: string,
  position: Position,
  summonerOne: SummonerSpell,
  summonerTwo: SummonerSpell,
  primaryRune: number,
  secondaryRune: number,
  items: IParticipantItem[],
  bannedChampion: string
} & Document

const ParticipantSchema = new Schema<IParticipant>({
  puuid: { type: String, required: true },
  participantId: { type: Number, required: true },
  username: { type: String, required: true },
  tag: { type: String, required: true },
  team: { type: String, enum: TEAM, required: true },
  champion: { type: String, required: true },
  position: { type: String, enum: POSITION, required: true },
  summonerOne: { type: Number, enum: SUMMONER_SPELL, required: true },
  summonerTwo: { type: Number, enum: SUMMONER_SPELL, required: true },
  primaryRune: { type: Number, required: true },
  secondaryRune: { type: Number, required: true },
  items: [{ type: ParticipantItemSchema, required: true }],
  bannedChampion: { type: String, required: true }
});

export const Participant = mongoose.model<IParticipant>('Participant', ParticipantSchema);