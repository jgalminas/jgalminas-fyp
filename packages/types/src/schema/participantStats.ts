import { Types } from "mongoose";

export type IParticipantStats = {
  _id: Types.ObjectId,
  participantId: number,
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
}