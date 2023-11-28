import { db } from "../db";
import { IMatch } from "../schema";
import { Event } from "../schema/event";
import { Frame } from "../schema/frame";
import { Match } from "../schema/match";
import { IParticipant, Participant } from "../schema/participant";
import { IParticipantStats, ParticipantStats } from "../schema/participantStats";
import { User } from "../schema/user";

export type InsertMatch = {
  frames: {
    participantStats: ({
      participantId?: number
    } & IParticipantStats)[]
  }[]
} & IMatch

export const insertMatch = async(userId: string, data: InsertMatch) => {

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

      // calculate kills, deaths and assists
      // for (const event in frame.events) {


      // }

    }

    data.participants = participants;
    data.frames = await Frame.insertMany(data.frames, { session });

    match = (await Match.create([data], { session }))[0];
    await User.findByIdAndUpdate(userId, { $push: { matches: match } });

    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    console.log(err);
    await session.abortTransaction();
    session.endSession();
  }

  return match?._id;
}

export const getMatchById = async(id: string) => await Match.findById(id);

export type Match = {
  participants: ({
    kills: number,
    deaths: number,
    assists: number
  } & IParticipant)[]
} & Omit<IMatch, 'frames'>

export const getUserMatches = async(userId: string, offset: number = 0, count: number = 10) => {

  const addStatsFieldToParticipant =  (stat: 'kills' | 'deaths' | 'assists') => {

    const eventField = () => {
      switch (stat) {
        case 'kills':
          return 'killerId';
        case 'assists':
          return 'assistingParticipantIds';
        case 'deaths':
          return 'victimId';
      }
    };

    return {
      $addFields: {
        participants: {
          $map: {
            input: "$participants",
            as: "participant",
            in: {
              $mergeObjects: [
                "$$participant",
                {
                  [`${stat}`]: {
                    $size: {
                      $filter: {
                        input: {
                          $reduce: {
                            input: "$frames.events",
                            initialValue: [],
                            in: {
                              $concatArrays: ["$$value", "$$this"]
                            }
                          }
                        },
                        as: 'event',
                        cond: {
                          [`${stat === 'assists' ? '$in': '$eq'}`]: [
                            '$$participant.participantId',
                            `$$event.${eventField()}`
                          ]
                        }
                      }
                    }
                  }
                }
              ]
            }
          }
        }
      }
    }
  }; 

  const result = await User.aggregate<{ matches: Match[] }>([
    {
      $match: {
        _id: userId
      }
    },
    {
      $lookup: {
        from: 'matches',
        localField: 'matches',
        foreignField: '_id',
        as: 'matches',
        pipeline: [
          {
            $lookup: {
              from: 'participants',
              localField: 'participants',
              foreignField: '_id',
              as: 'participants'
            }
          },
          {
            $lookup: {
              from: 'frames',
              localField: 'frames',
              foreignField: '_id',
              as: 'frames',
              pipeline: [
                {
                  $lookup: {
                    from: 'events',
                    localField: 'events',
                    foreignField: '_id',
                    as: 'events'
                  }
                }
              ]
            }
          },
          addStatsFieldToParticipant('kills'),
          addStatsFieldToParticipant('deaths'),
          addStatsFieldToParticipant('assists'),
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
          }
        ]
      }
    },
    {
      $project: {
        matches: {
          frames: 0
        }
      }
    },
    {
      $replaceRoot: {
        newRoot: {
          matches: '$matches'
        }
      }
    },
  ]);

  return result[0].matches;
}