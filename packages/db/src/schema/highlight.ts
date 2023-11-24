import mongoose from "mongoose";
import { Schema } from "../db";
import { Position } from "./index";
import { POSITION } from "./enums";

export type IHighlight = {
  start: number,
  finish: number,
  championId: number,
  position: Position,
  createdAt: Date,
  publicUrl: string | null
} & Document

const HighlightSchema = new Schema<IHighlight>({
  start: { type: Number, required: true },
  finish: { type: Number, required: true },
  championId: { type: Number, required: true },
  position: { type: String, enum: POSITION, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  publicUrl: { type: String }
});

export const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);