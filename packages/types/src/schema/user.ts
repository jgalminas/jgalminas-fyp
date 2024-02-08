import { Types } from "mongoose";
import { IHighlight, IRecording } from ".";
import { Regions } from "..";

export type IUser = {
  _id: Types.ObjectId,
  email: string,
  username: string,
  password: string,
  createdAt: Date,
  summoner?: {
    name: string,
    tag: string,
    puuid: string,
    profileIconId: number,
    region: Regions
  },
  recordings: IRecording[]
  highlights: IHighlight[]
}