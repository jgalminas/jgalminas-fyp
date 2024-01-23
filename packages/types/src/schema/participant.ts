import { Types } from "mongoose";
import { Position, SummonerSpell, Team } from "./index";

export type IParticipantItem = {
  _id: number,
  slot: number
}

export type IParticipant = {
  _id: Types.ObjectId,
  puuid: string,
  participantId: number,
  username: string,
  tag: string,
  team: Team,
  champion: string,
  position?: Position,
  summonerOne: SummonerSpell,
  summonerTwo: SummonerSpell,
  primaryRune: number,
  secondaryRune: number,
  items: IParticipantItem[],
  // bannedChampion: string
  kills: number,
  assists: number,
  deaths: number,
  cs: number,
  level: number
}