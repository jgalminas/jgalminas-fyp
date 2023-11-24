import mongoose from "mongoose";
import { ObjectId, Schema } from "../db";
import { IEvent, IParticipantStats } from "./index";

export type IFrame = {
  timestamp: number,
  events: IEvent[],
  participantStats: IParticipantStats[]
} & Document

const FrameSchema = new Schema<IFrame>({
  timestamp: { type: Number, required: true },
  events: [{ type: ObjectId, ref: 'Event', required: true }],
  participantStats: [{ type: ObjectId, ref: 'ParticipantStats', required: true }]
});

export const Frame = mongoose.model<IFrame>('Frame', FrameSchema);