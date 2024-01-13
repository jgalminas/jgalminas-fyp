import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import { IRecording, POSITION } from "@fyp/types";

const RecordingSchema = new Schema<IRecording>({
  match: { type: ObjectId, required: true },
  gameId: { type: String, required: true },
  length: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  champion: { type: String, required: true },
  position: { type: String, required: true, enum: POSITION },
  size: { type: Number, required: true }
});

export const Recording = mongoose.model<IRecording>('Recording', RecordingSchema);