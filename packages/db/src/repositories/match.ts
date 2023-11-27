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

export const getUserMatches = async(userId: string, offset: number = 0, count: number = 10) => {

  const puuid = 'string';

// return await User.aggregate([
//   {
//     $match: {
//       _id: userId
//     }
//   },
//   {
//     $lookup: {
//       from: 'matches',
//       localField: 'matches',
//       foreignField: '_id',
//       as: 'matches',
//     }
//   },
//   {
//     $lookup: {
//       from: 'participants',
//       localField: 'matches.participants',
//       foreignField: '_id',
//       as: 'participants',
//     }
//   },
//   {
//     $lookup: {
//       from: 'frames',
//       localField: 'matches.frames',
//       foreignField: '_id',
//       as: 'frames'
//     }
//   },
//   {
//     $lookup: {
//       from: 'events',
//       localField: 'frames.events',
//       foreignField: '_id',
//       as: 'events'
//     }
//   },
//   {
//     $addFields: {
//       player: {
//         $let: {
//           vars: {
//             participant: {
//               $arrayElemAt: [
//                 {
//                   $filter: {
//                     input: '$participants',
//                     as: 'participant',
//                     cond: {
//                       $eq: ['$$participant.puuid', puuid]
//                     }
//                   }
//                 },
//                 0
//               ]
//             },
//           },
//           in: {
//             $mergeObjects: [
//               '$$participant',
//               {
//                 kills: {
//                   $size: {
//                     $filter: {
//                       input: '$events',
//                       as: 'event',
//                       cond: {
//                         $eq: [
//                           '$$event.killerId',
//                           '$$participant.participantId'
//                         ]
//                       }
//                     }
//                   }
//                 },
//                 deaths: {
//                   $size: {
//                     $filter: {
//                       input: '$events',
//                       as: 'event',
//                       cond: {
//                         $eq: [
//                           '$$event.victimId',
//                           '$$participant.participantId'
//                         ]
//                       }
//                     }
//                   }
//                 },
//                 assists: {
//                   $size: {
//                     $filter: {
//                       input: '$events',
//                       as: 'event',
//                       cond: {
//                         $in: [
//                           '$$participant.participantId',
//                           '$$event.assistingParticipantIds'
//                         ]
//                       }
//                     }
//                   }
//                 }
//               }
//             ],
//           }
//         }
//       }
//     }
//   }
// ])

// return await User.aggregate([
//   {
//     $match: {
//       _id: userId
//     }
//   },
//   {
//     $lookup: {
//       from: 'matches',
//       localField: 'matches',
//       foreignField: '_id',
//       as: 'matches',
//     }
//   },
//   {
//     $addFields: {
//       matchesWithPlayer: {
//         $map: {
//           input: '$matches',
//           as: 'match',
//           in: {
//             $mergeObjects: [
//               '$$match',
//               {
//                 players: {
//                   $map: {
//                     input: '$$match.participants',
//                     as: 'participant',
//                     in: {
//                       $mergeObjects: [
//                         '$$participant',
//                         {
//                           kills: {
//                             $size: {
//                               $filter: {
//                                 input: '$$match.frames.events',
//                                 as: 'event',
//                                 cond: {
//                                   $eq: [
//                                     '$$event.killerId',
//                                     '$$participant.participantId'
//                                   ]
//                                 }
//                               }
//                             }
//                           },
//                           deaths: {
//                             $size: {
//                               $filter: {
//                                 input: '$$match.frames.events',
//                                 as: 'event',
//                                 cond: {
//                                   $eq: [
//                                     '$$event.victimId',
//                                     '$$participant.participantId'
//                                   ]
//                                 }
//                               }
//                             }
//                           },
//                           assists: {
//                             $size: {
//                               $filter: {
//                                 input: '$$match.frames.events',
//                                 as: 'event',
//                                 cond: {
//                                   $in: [
//                                     '$$participant.participantId',
//                                     '$$event.assistingParticipantIds'
//                                   ]
//                                 }
//                               }
//                             }
//                           }
//                         }
//                       ]
//                     }
//                   }
//                 }
//               }
//             ]
//           }
//         }
//       }
//     }
//   },
//   // {
//   //   $project: {
//   //     matchesWithPlayer: 1
//   //   }
//   // }
// ]);


return await User.aggregate([
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
              },
            ]
          }
        },
        {
          $addFields: {
            participants: {
              allEvents: {
                $size: { // count kills here
                  $reduce: {
                    input: "$frames.events",
                    initialValue: [],
                    in: {
                      $concatArrays: ["$$value", "$$this"]
                    }
                  }
                }
              }
            }
          }
        },
      ]
    }
  },
  // {
  //   $addFields: {
  //     matches: {
  //       $map: {
  //         input: '$matches',
  //         as: 'match',
  //         in: {
  //           $mergeObjects: [
  //             '$$match',
  //             "participants" 
  //             {
  //               value: 0
  //             }
  //           ]
  //         }
  //       }
  //       // kills: {

  //       //   // $size: {
  //       //   //   $filter: {
  //       //   //     input: '$frames.allEvents',
  //       //   //     as: 'event',
  //       //   //     cond: {
  //       //   //       $eq: [
  //       //   //         1,
  //       //   //         1
  //       //   //       ]
  //       //   //     }
  //       //   //   }
  //       //   // }
  //       // }
  //     }
  //   }
  // }
]);

}

// {
//   $lookup: {
//     from: 'frames',
//     localField: 'frames',
//     foreignField: '_id',
//     as: 'frames',
//     pipeline: [
//       {
//         $lookup: {
//           from: 'events',
//           localField: 'events',
//           foreignField: '_id',
//           as: 'events',
//           pipeline: []
//         }
//       }
//     ]
//   }
// }

              // count: {
              //   $size: {
              //     $filter: {
              //       input: '$$ROOT.frames.events',
              //       as: 'event',
              //       cond: {
              //         $eq: [
              //           '$$event.killerId',
              //           1
              //         ]
              //       }
              //     }
              //   }
              // }