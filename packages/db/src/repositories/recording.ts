import { IRecording, IUser } from "@fyp/types";
import { Recording } from "../schema/recording";
import { Types } from 'mongoose';
import { db } from "../db";
import { User } from "../schema";

export type InsertRecording = {
  match: string, 
} & Omit<IRecording, '_id'>

export const insertRecording = async(userId: string, data: InsertRecording) => {

  const session = await (await db).startSession();
  session.startTransaction();

  try {

    const result = await Recording.create([
      {
        ...data,
        match: new Types.ObjectId(data.match),
      }
    ], { session });

    if (result.length > 0) {

      await User.updateOne(
        { _id: new Types.ObjectId(userId) },
        {
          $push: {
            recordings: result[0]._id
          }
      })

      await session.commitTransaction();
      session.endSession();
      return result[0]._id;

    } else {
      await session.abortTransaction();
      session.endSession();
      return null;
    }

  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
    return null;
  }

}

export const getRecordings = async(
  userId: string,
  filters?: {
    role: string,
    queue?: number,
    date: -1 | 1,
    champion?: string,
    start: number,
    offset: number
  }
  ) => {
  
  const pagination = () => {
    if (!filters) return [];
    return [
      {
        $skip: filters.start
      },
      {
        $limit: filters.offset
      }
    ]
  }

  const result = await User.aggregate<IUser>([
    {
      $match: {
        _id: new Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: 'recordings',
        localField: 'recordings',
        foreignField: '_id',
        as: 'recordings',
        pipeline: [
          {
            $match: {
              $and: [
                (filters?.champion && filters.champion !== 'all' ? {
                  champion: {
                    $regex: new RegExp(filters.champion, 'i')
                  }
                } : {}),
                (filters?.role && filters.role !== 'FILL' ? {
                  position: {
                    $regex: new RegExp(filters.role, 'i')
                  }
                } : {}),
                (filters?.queue && filters.queue !== 0 ? {
                  queueId: filters.queue
                } : {})
              ]
            }
          },
          {
            $sort: {
              createdAt: filters?.date ?? -1
            }
          },
          ...pagination()
        ]
      }
    }
  ]);

  if (result.length > 0) {
    return result[0].recordings;
  } else {
    return [];
  }

} 