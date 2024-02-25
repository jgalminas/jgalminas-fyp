import mongoose from "mongoose";
import { Schema } from "../db/db";
import { IParticipant, POSITION, SUMMONER_SPELL, TEAM } from "@fyp/types";

const ParticipantSchema = new Schema<IParticipant>({
  puuid: { type: String, required: true },
  participantId: { type: Number, required: true },
  username: { type: String, required: true },
  tag: { type: String, required: true },
  team: { type: String, enum: TEAM, required: true },
  champion: { type: String, required: true },
  position: { type: String, enum: POSITION, required: false },
  summonerOne: { type: Number, enum: SUMMONER_SPELL, required: true },
  summonerTwo: { type: Number, enum: SUMMONER_SPELL, required: true },
  primaryRune: { type: Number, required: true },
  secondaryRune: { type: Number, required: true },
  items: [
    {
      type: {
        _id: { type: Number, required: true },
        slot: { type: Number, required: true }
      },
      required: true
    }
  ],
  kills: { type: Number, required: true },
  assists: { type: Number, required: true },
  deaths: { type: Number, required: true },
  cs: { type: Number, required: true },
  level: { type: Number, required: true },
  // bannedChampion: { type: String, required: true }
});

export const Participant = mongoose.model<IParticipant>('Participant', ParticipantSchema);