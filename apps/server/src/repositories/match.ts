import { MatchWithGoldFrames, IEvent, IFrame, IMatch, IParticipant, IParticipantStats, Match as RMatch, AggregatedEvents } from "@fyp/types";
import { Types } from 'mongoose';
import { db } from "../db/db";
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



export const getUserMatches = async(
  puuid: string,
  filters?: {
    role: string,
    queue?: number,
    date: -1 | 1,
    champion?: string,
    start: number,
    offset: number
  }) => {

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
        $and: [
          { 'participants.puuid': puuid },
          (filters?.champion && filters.champion !== 'all' ? {
            'participants': {
              $elemMatch: {
                'puuid': puuid,
                'champion': {
                  $regex: new RegExp(filters.champion, 'i')
                }
              }
            }
          } : {}),
          (filters?.role && filters.role !== 'FILL' ? {
            'participants': {
              $elemMatch: {
                'puuid': puuid,
                'position': {
                  $regex: new RegExp(filters.role, 'i')
                }
              }
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
        finish: filters?.date ?? -1
      }
    },
    ...pagination(),
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

export const getGoldFrames = async(id: string) => {

  const result = await Match.aggregate<MatchWithGoldFrames>([
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
        as: 'participants',
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
          },
          {
            $unwind: "$participantStats"
          },
          {
            $group: {
              _id: {
                team: '$team',
                timestamp: '$timestamp',
                frameId: '$_id',
                participantId: '$participantStats.participantId'
              },
              totalGold: { $sum: '$participantStats.totalGold' }
            }
          },
          {
            $project: {
              team: '$_id.team',
              frameId: '$_id.frameId',
              timestamp: '$_id.timestamp',
              participantId: '$_id.participantId',
              totalGold: 1,
              _id: 0
            }
          },
          {
            $group: {
              _id: {
                team: '$team',
                timestamp: '$timestamp',
                frameId: '$frameId'
              },
              blueGold: {
                $sum: {
                  $cond: {
                    if: { $lte: ['$participantId', 5] },
                    then: '$totalGold',
                    else: 0
                  }
                }
              },
              redGold: {
                $sum: {
                  $cond: {
                    if: { $gt: ['$participantId', 5] },
                    then: '$totalGold',
                    else: 0
                  }
                }
              }
            }
          },
          {
            $sort: {
              "_id.timestamp": 1
            }
          },
          {
            $project: {
              _id: 0,
              team: '$_id.team',
              frameId: '$_id.frameId',
              timestamp: '$_id.timestamp',
              blueGold: 1,
              redGold: 1
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

export const getEvents = async(id: string, puuid: string) => {

  const result = await Match.aggregate<AggregatedEvents>([
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
      $unwind: '$participants'
    },
    {
      $match: {
        'participants.puuid': puuid
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
        start: 1,
        finish: 1,
        participants: 1,
        events: { $reduce: { input: '$frames.events', initialValue: [], in: { $concatArrays: ['$$value', '$$this'] } } }
      }
    },
    {
      $project: {
        duration: {
          $subtract: ['$finish', '$start']
        },
        events: {
          $filter: {
            input: {
              $map: {
                input: '$events',
                as: 'event',
                in: {
                  $cond: {
                    if: {
                      $and: [
                        { $eq: ['$$event.type', 'CHAMPION_KILL'] },
                        { $eq: ['$$event.killerId', '$participants.participantId'] }
                      ]
                    },
                    then: {
                      type: 'KILL',
                      timestamp: '$$event.timestamp'
                    },
                    else: {
                      $cond: {
                        if: {
                          $and: [
                            { $eq: ['$$event.type', 'CHAMPION_KILL'] },
                            { $eq: ['$$event.victimId', '$participants.participantId'] }
                          ]
                        },
                        then: {
                          type: 'DEATH',
                          timestamp: '$$event.timestamp'
                        },
                        else: {
                          $cond: {
                            if: {
                              $and: [
                                { $eq: ['$$event.type', 'CHAMPION_KILL'] },
                                { $in: ['$participants.participantId', '$$event.assistingParticipantIds'] }
                              ]
                            },
                            then: {
                              type: 'ASSIST',
                              timestamp: '$$event.timestamp'
                            },
                            else: null
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            as: 'filteredEvent',
            cond: { $ne: ['$$filteredEvent', null] }
          }
        }
      }
    },
  ]);

  if (result.length > 0) {
    return result[0];
  } else {
    return [];
  }
}