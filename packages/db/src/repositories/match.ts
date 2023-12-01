import { db } from "../db";
import { IMatch } from "../schema";
import { Event } from "../schema/event";
import { Frame } from "../schema/frame";
import { Match } from "../schema/match";
import { IParticipant, Participant } from "../schema/participant";
import { ParticipantStats } from "../schema/participantStats";

export const insertMatch = async(data: IMatch) => {

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
    assists: number,
    cs: number,
    level: number
  } & IParticipant)[]
} & Omit<IMatch, 'frames'>

export const getUserMatches = async(puuid: string, offset: number = 0, count: number = 10) => {

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
  };

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
          },
          {
            $lookup: {
              from: 'participantstats',
              localField: 'participantStats',
              foreignField: '_id',
              as: 'participantStats'
            }
          },
        ]
      }
    },
    {
      $addFields: {
        participants: {
          $map: {
            input: "$participants",
            as: "participant",
            in: {
              $let: {
                vars: {
                  lastFrame: { $arrayElemAt: ['$frames', -1] },
                },
                in: {
                  $let: {
                    vars: {
                      stats: {
                        $arrayElemAt: [
                          {
                            $filter: {
                              input: '$$lastFrame.participantStats',
                              as: 'stats',
                              cond: {
                                $eq: [
                                  '$$participant.participantId',
                                  '$$stats.participantId'
                                ]
                              }
                            }
                          },
                          0
                        ]
                      }
                    },
                    in: {
                      $mergeObjects: [
                        '$$participant',
                        {
                          cs: {
                            $add: ['$$stats.jungleMinionsKilled', '$$stats.minionsKilled']
                          },
                          level: '$$stats.level',
                          kills: addStatsFieldToParticipant('kills'),
                          assists: addStatsFieldToParticipant('assists'),
                          deaths: addStatsFieldToParticipant('deaths')
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
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
    }
  ])
}