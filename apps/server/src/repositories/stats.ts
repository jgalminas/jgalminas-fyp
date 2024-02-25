import { AverageStats, ChampionStats } from "@fyp/types";
import { Match } from "../schema"

export const getAverageStats = async(puuid: string) => {
  const result = await Match.aggregate<AverageStats>([
    {
      $lookup: {
        from: 'participants',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $unwind: "$participants"
    },
    {
      $match: {
        "participants.puuid": puuid
      }
    },
    {
      $group: {
        _id: "$participants.puuid",
        totalMatches: { $sum: 1 },
        totalWins: {
          $sum: {
            $cond: [
              { $eq: ["$winningTeam", "$participants.team"] },
              1,
              0
            ]
          }
        },
        totalKills: { $sum: "$participants.kills" },
        totalDeaths: { $sum: "$participants.deaths" },
        totalAssists: { $sum: "$participants.assists" }
      }
    },
    {
      $project: {
        _id: 0,
        totalMatches: 1,
        totalWins: 1,
        avgKills: { $divide: ["$totalKills", "$totalMatches"] },
        avgDeaths: { $divide: ["$totalDeaths", "$totalMatches"] },
        avgAssists: { $divide: ["$totalAssists", "$totalMatches"] },
        kda: {
          $divide: [
            { $add: ["$totalKills", "$totalAssists"] },
            { $cond: [{ $eq: ["$totalDeaths", 0] }, 1, "$totalDeaths"] }
          ]
        }
      }
    }
  ])

  if (result.length <= 0) {
    return null;
  }

  return result[0];
}

export const getChampionStats = async(puuid: string) => {
  return await Match.aggregate<ChampionStats>([
    {
      $lookup: {
        from: 'participants',
        localField: 'participants',
        foreignField: '_id',
        as: 'participants'
      }
    },
    {
      $unwind: "$participants"
    },
    {
      $match: {
        "participants.puuid": puuid
      }
    },
    {
      $group: {
        _id: { puuid: "$participants.puuid", champion: "$participants.champion" },
        totalMatches: { $sum: 1 },
        totalWins: {
          $sum: {
            $cond: [
              { $eq: ["$winningTeam", "$participants.team"] },
              1,
              0
            ]
          }
        },
        totalKills: { $sum: "$participants.kills" },
        totalDeaths: { $sum: "$participants.deaths" },
        totalAssists: { $sum: "$participants.assists" }
      }
    },
    {
      $project: {
        _id: 0,
        champion: "$_id.champion",
        totalMatches: 1,
        totalWins: 1,
        totalKills: 1,
        totalDeaths: 1,
        totalAssists: 1,
        winRate: {
          $divide: ["$totalWins", "$totalMatches"]
        },
        kda: {
          $cond: [
            { $eq: ["$totalDeaths", 0] },
            { $divide: [{ $add: ["$totalKills", "$totalAssists"] }, 1] },
            { $divide: [{ $add: ["$totalKills", "$totalAssists"] }, "$totalDeaths"] }
          ]
        }
      }
    },
    {
      $sort: {
        totalMatches: -1,
        champion: -1
      }
    },
    {
      $limit: 5
    }
  ]);
}