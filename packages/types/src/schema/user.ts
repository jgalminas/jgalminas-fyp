import { Types } from "mongoose";

export type IUser = {
  _id: Types.ObjectId,
  email: string,
  username: string,
  password: string,
  createdAt: Date,
  puuid: string | undefined
}