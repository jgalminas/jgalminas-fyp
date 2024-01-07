import { Types } from "mongoose";
import { Building, Lane, Monster, SpecialKillType } from "./enums";

export type CreateEvent =
  | ({ type: 'CHAMPION_KILL' } & Omit<IKillEvent, '_id'>)
  | ({ type: 'ELITE_MONSTER_KILL' } & Omit<IEliteKillEvent, '_id'>)
  | ({ type: 'BUILDING_KILL' } & Omit<IBuildingKillEvent, '_id'>)
  | ({ type: 'TURRET_PLATE_DESTROYED' } & Omit<IPlateDestroyedEvent, '_id'>)
  | ({ type: 'CHAMPION_SPECIAL_KILL' } & Omit<ISpecialKillEvent, '_id'>);

export type IEvent = {
  type: 'CHAMPION_KILL'
} & IKillEvent | {
  type: 'ELITE_MONSTER_KILL'
} & IEliteKillEvent | {
  type: 'BUILDING_KILL',
} & IBuildingKillEvent | {
  type: 'TURRET_PLATE_DESTROYED'
} & IPlateDestroyedEvent | {
  type: 'CHAMPION_SPECIAL_KILL'
} & ISpecialKillEvent

export type IBaseEvent = {
  _id: Types.ObjectId,
  timestamp: number,
}

export type IKillEvent = {
  killerId: number,
  victimId: number,
  assistingParticipantIds: number[]
} & IBaseEvent

export type IEliteKillEvent = {
  killerId: number,
  monsterType: Monster,
  assistingParticipantIds: number[]
} & IBaseEvent

export type IBuildingKillEvent = {
  killerId: number,
  lane: Lane
  buildingType: Building,
  assistingParticipantIds: number[]
} & IBaseEvent

export type IPlateDestroyedEvent = {
  killerId: number,
  lane: Lane
} & IBaseEvent

export type ISpecialKillEvent = {
  killerId: number,
  multiKillLength: number,
  killType: SpecialKillType
} & IBaseEvent