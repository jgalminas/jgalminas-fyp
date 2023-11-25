import mongoose from "mongoose";
import { Schema } from "../db";

export type IParticipantItem = {
  _id: number,
  slot: number
} & Document

export const ParticipantItemSchema = new Schema<IParticipantItem>({
  _id: { type: Number, required: true },
  slot: { type: Number, required: true }
});

export const ParticipantItem = mongoose.model<IParticipantItem>('ParticipantItem', ParticipantItemSchema);