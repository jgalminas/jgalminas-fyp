import mongoose from "mongoose";
import { Schema } from "../db";

export type IRune = {
  _id: number,
  name: string
} & Document

const RuneSchema = new Schema<IRune>({
  _id: { type: Number, rquired: true, unique: true, indexed: true },
  name: { type: String, required: true }
});

export const Rune = mongoose.model<IRune>('Rune', RuneSchema);