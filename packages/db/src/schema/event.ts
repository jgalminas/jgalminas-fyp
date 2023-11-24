import mongoose from "mongoose";
import { Schema } from "../db";
import { EventType } from "./index";
import { BUILDING, Building, EVENT_TYPE, LANE, Lane, MONSTER, Monster, SPECIAL_KILL_TYPE, SpecialKillType } from "./enums";

export type IEvent = {
  type: EventType,
  timestamp: number,
} & Document

export type IKillEvent = {
  killerId: number,
  victimId: number,
  assistingParticipantIds: number[]
} & IEvent

export type IEliteKillEvent = {
  killerId: number,
  monsterType: Monster,
  assistingParticipantIds: number[]
} & IEvent

export type IBuildingKillEvent = {
  killerId: number,
  lane: Lane
  buildingType: Building,
  assistingParticipantIds: number[]
} & IEvent

export type IPlateDestroyedEvent = {
  killerId: number,
  lane: Lane
} & IEvent

export type ISpecialKillEvent = {
  killerId: number,
  multiKillLength: number,
  killType: SpecialKillType
} & IEvent

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
