import mongoose from "mongoose";
import { Schema } from "../db";
import { BUILDING, Building, EVENT_TYPE, LANE, Lane, MONSTER, Monster, SPECIAL_KILL_TYPE, SpecialKillType } from "./enums";

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
  _id: mongoose.ObjectId,
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

const EventSchema = new Schema<IEvent>({
  type: { type: String, enum: EVENT_TYPE, required: true },
  timestamp: { type: Number, required: true }
}, { discriminatorKey: 'type' });

const SpecialKillEventSchema = new Schema<ISpecialKillEvent>({
  killerId: { type: Number, required: true },
  multiKillLength: { type: Number, required: true },
  killType: { type: String, enum: SPECIAL_KILL_TYPE, required: true }
});

const PlateDestroyedEventSchema = new Schema<IPlateDestroyedEvent>({
  killerId: { type: Number, required: true },
  lane: { type: String, enum: LANE, required: true }
});

const BuildingKillEventSchema = new Schema<IBuildingKillEvent>({
  killerId: { type: Number, required: true },
  lane: { type: String, enum: LANE, required: true },
  buildingType: { type: String, enum: BUILDING, required: true },
  assistingParticipantIds: [{ type: Number, required: true }]
});

const EliteKillEventSchema = new Schema<IEliteKillEvent>({
  killerId: { type: Number, required: true },
  monsterType: { type: String, enum: MONSTER, required: true },
  assistingParticipantIds: [{ type: Number, required: true }]
});

const KillEventSchema = new Schema<IKillEvent>({
  killerId: { type: Number, required: true },
  victimId: { type: Number, required: true },
  assistingParticipantIds: [{ type: Number, required: true }]
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
export const SpecialKillEvent = Event.discriminator<ISpecialKillEvent>('CHAMPION_SPECIAL_KILL', SpecialKillEventSchema);
export const PlateDestroytedEvent = Event.discriminator<IPlateDestroyedEvent>('TURRET_PLATE_DESTROYED', PlateDestroyedEventSchema);
export const BuldingKillEvent = Event.discriminator<IBuildingKillEvent>('BUILDING_KILL', BuildingKillEventSchema);
export const EliteKillEvent = Event.discriminator<IEliteKillEvent>('ELITE_MONSTER_KILL', EliteKillEventSchema);
export const KillEvent = Event.discriminator<IKillEvent>('CHAMPION_KILL', KillEventSchema);
