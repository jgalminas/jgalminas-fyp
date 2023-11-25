import { db } from "../db";
import { IMatch } from "../schema";
import { Event } from "../schema/event";
import { Frame } from "../schema/frame";
import { Match } from "../schema/match";
import { IParticipant, Participant } from "../schema/participant";
import { IParticipantStats, ParticipantStats } from "../schema/participantStats";

export type InsertMatch = {
  frames: {
    participantStats: ({
      participantId?: number
    } & IParticipantStats)[]
  }[]
} & IMatch

export const insertMatch = async(data: InsertMatch) => {

  const session = await (await db).startSession();
  session.startTransaction();

  let match;

  try {
    const participants = await Participant.insertMany(data.participants, { session });

    for (let frame of data.frames) {
      // create participant stats
      for (let stats of frame.participantStats) {
        stats.participant = participants.find(p => p.participantId === stats.participantId) as IParticipant;        
      }
      frame.participantStats = await ParticipantStats.insertMany(frame.participantStats, { session });

      // create events
      frame.events = await Event.insertMany(frame.events, { session });
    }

    data.participants = participants;
    data.frames = await Frame.insertMany(data.frames, { session });

    match = (await Match.create([data], { session }))[0];
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
  }

  return match;
} 