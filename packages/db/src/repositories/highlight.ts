import { IHighlight, IUser } from "@fyp/types";
import { db } from "../db";
import { Highlight, User } from "../schema";
import { Types } from "mongoose";

export type InsertHighlight = {
  match: string,
} & Omit<IHighlight, '_id'>

export const insertHighlight = async(userId: string, data: InsertHighlight) => {

  const session = await (await db).startSession();
  session.startTransaction();

  try {

    const result = await Highlight.create([
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
            highlights: result[0]._id
          }
      })

      await session.commitTransaction();
      session.endSession();
      return result[0];

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

export const getHighlights = async(
  userId: string,
  filters?: {
    role: string,
    queue?: number,
    date: -1 | 1,
    champion?: string,
    start: number,
    offset: number,
    match?: string
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
        from: 'highlights',
        localField: 'highlights',
        foreignField: '_id',
        as: 'highlights',
        pipeline: [
          {
            $match: {
              $and: [
                (filters?.match && filters.match.length === 24 ? {
                  match: new Types.ObjectId(filters.match)
                } : {}),
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
    return result[0].highlights;
  } else {
    return [];
  }

}

export const getHighlightById = async(userId: string, id: string) => {

  try {
    const result = await User.aggregate<IHighlight>([
      {
        $match: {
          _id: new Types.ObjectId(userId)
        }
      },
      {
        $lookup: {
          from: 'highlights',
          localField: 'highlights',
          foreignField: '_id',
          as: 'highlights',
          pipeline: [
            {
              $match: {
                _id: new Types.ObjectId(id)
              }
            }
          ]
        }
      },
      {
        $unwind: '$highlights'
      },
      {
        $replaceRoot: {
          newRoot: '$highlights'
        }
      }
    ]);
  
    if (result.length > 0) {
      return result[0];
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }

};