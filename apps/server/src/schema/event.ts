import mongoose from "mongoose";
import { Schema } from "../db/db";
import {
  BUILDING,
  EVENT_TYPE,
  IBuildingKillEvent,
  IEliteKillEvent,
  IEvent,
  IKillEvent,
  IPlateDestroyedEvent,
  ISpecialKillEvent,
  LANE,
  MONSTER,
  SPECIAL_KILL_TYPE,
} from "@fyp/types";



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
