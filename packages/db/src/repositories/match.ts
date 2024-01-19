import { IEvent, IFrame, IMatch, IParticipant, IParticipantStats, Match as RMatch } from "@fyp/types";
import { Types } from 'mongoose';
import { db } from "../db";
import { Event } from "../schema/event";
import { Frame } from "../schema/frame";
import { Match } from "../schema/match";
import { Participant } from "../schema/participant";
import { ParticipantStats } from "../schema/participantStats";

export type InsertMatch = {
  participants: Omit<IParticipant, '_id'>[],
  frames: ({
    events: Omit<IEvent, '_id'>[],
    participantStats: Omit<IParticipantStats, '_id'>[]
  } & Omit<IFrame, '_id' | 'events' | 'participantStats'>)[]
} & Omit<IMatch, '_id' | 'participants' | 'frames'>

export const insertMatch = async(id: string, data: InsertMatch) => {

  const session = await (await db).startSession();
  session.startTransaction();

  let match;

  try {
    const participants = await Participant.insertMany(data.participants, { session });

    for (let frame of data.frames) {
      frame.participantStats = await ParticipantStats.insertMany(frame.participantStats, { session });
      frame.events = await Event.insertMany(frame.events, { session });
    }

    data.participants = participants;
    data.frames = await Frame.insertMany(data.frames, { session });

    match = (await Match.create([{_id: id, ...data}], { session }))[0];

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    
    await session.abortTransaction();
    session.endSession();
  }

  return match;
}

export const getMatchById = async(id: string) => {

  const result = await Match.aggregate<RMatch>([
    {
      $lookup: {
        from: 'participants',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $match: {
        '_id': new Types.ObjectId(id)
      }
    },
    {
      $addFields: {
        lastFrame: { $arrayElemAt: ['$frames', -1] }
      }
    },
    {
      $lookup: {
        from: 'frames',
        localField: 'lastFrame',
        foreignField: '_id',
        as: 'lastFrame'
      },
    },
    {
      $lookup: {
        from: 'participantstats',
        localField: 'lastFrame.participantStats',
        foreignField: '_id',
        as: 'participantStats'
      },
    },
    {
      $project: {
        frames: 0,
        lastFrame: 0
      }
    }
  ])

  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}

export const getUserMatches = async(puuid: string, offset: number = 0, count: number = 10) => {

  return await Match.aggregate<RMatch>([
    {
      $lookup: {
        from: 'participants',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $match: {
        'participants.puuid': puuid
      }
    },
    {
      $sort: {
        finish: 1
      }
    },
    {
      $skip: offset
    },
    {
      $limit: count
    },
    {
      $project: {
        frames: 0
      }
    }
  ])
}

export const getMatchTimeline = async(id: string) => {

  const result = await Match.aggregate<IMatch>([
    {
      $match: {
        _id: new Types.ObjectId(id)
      }
    },
    {
      $lookup: {
        from: 'participants',
        foreignField: '_id',
        localField: 'participants',
        as: 'participants'
      }
    },
    {
      $lookup: {
        from: 'frames',
        foreignField: '_id',
        localField: 'frames',
        as: 'frames',
        pipeline: [
          {
            $sort: {
              timestamp: 1
            }
          },
          {
            $lookup: {
              from: 'events',
              foreignField: '_id',
              localField: 'events',
              as: 'events',
              pipeline: [
                {
                  $sort: {
                    timestamp: 1
                  }
                }
              ]
            }
          },
          {
            $lookup: {
              from: 'participantstats',
              foreignField: '_id',
              localField: 'participantStats',
              as: 'participantStats'
            }
          }
        ]
      }
    },
    {
      $project: {
        bans: 0
      }
    }
  ]);

  if (result.length > 0) {
    return result[0];
  } else {
    return null;
  }
}