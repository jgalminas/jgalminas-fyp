import { IEvent, IFrame, IMatch, IParticipant, IParticipantStats } from "@fyp/types";
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

export const insertMatch = async(data: InsertMatch) => {

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

    match = (await Match.create([data], { session }))[0];

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
  }

  return match?._id;
}

export const getMatchById = async(id: string) => await Match.findById(id);

export const getUserMatches = async(puuid: string, offset: number = 0, count: number = 10) => {

  return await Match.aggregate([
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