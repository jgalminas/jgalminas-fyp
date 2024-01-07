import { Types } from "mongoose";
import { IEvent, IParticipantStats } from "./index";

export type IFrame = {
  _id: Types.ObjectId,
  timestamp: number,
  events: IEvent[],
  participantStats: IParticipantStats[]
}