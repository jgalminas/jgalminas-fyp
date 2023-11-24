import mongoose from "mongoose";
import { Schema } from "../db";

export type IParticipantItem = {
  itemId: number,
  itemSlot: number
} & Document

const ParticipantItemSchema = new Schema<IParticipantItem>({
  itemId: { type: Number, required: true },
  itemSlot: { type: Number, required: true }
});

export const ParticipantItem = mongoose.model<IParticipantItem>('ParticipantItem', ParticipantItemSchema);