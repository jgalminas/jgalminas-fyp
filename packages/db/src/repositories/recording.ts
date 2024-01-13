import { IRecording } from "@fyp/types";
import { Recording } from "../schema/recording";
import { Types } from 'mongoose';

export type InsertRecording = {
  match: string, 
} & Omit<IRecording, '_id'>

export const insertRecording = async(data: InsertRecording) => {

  try {
    const result = await Recording.create({
      ...data,
      match: new Types.ObjectId(data.match),
    });
    return result._id;
  } catch (err) {
    console.log(err);
    return null;
  }

}