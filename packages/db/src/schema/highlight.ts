import mongoose from "mongoose";
import { Schema, ObjectId } from "../db";
import { IHighlight, POSITION, QUEUE } from "@fyp/types";

const HighlightSchema = new Schema<IHighlight>({  
  match: { type: ObjectId, required: true, ref: 'Match' },
  fileId: { type: String, required: true },
  length: { type: Number, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  champion: { type: String, required: true },
  position: { type: String, required: false, enum: POSITION },
  size: { type: Number, required: true },
  queueId: { type: Number, enum: QUEUE, required: true },
  publicUrl: { type: String, required: false },
  tags: [{ type: String, required: true }]
});

export const Highlight = mongoose.model<IHighlight>('Highlight', HighlightSchema);