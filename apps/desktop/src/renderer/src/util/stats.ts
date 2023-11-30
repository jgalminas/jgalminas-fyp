import { Match } from "@fyp/types"

export type Stats = {
  kills: number,
  deaths: number,
  assists: number
}

export const calcKDA = (stats: Stats) => {
  return stats.deaths === 0 ? (stats.kills + stats.assists).toFixed(2) : ((stats.kills + stats.assists) / stats.deaths).toFixed(2)
}

export const aggregateTeamKills = (participants: Match['participants'], team: Match['participants'][number]['team']) => {
  let kills = 0;
  participants.filter(p => p.team === team).forEach((p) => kills = p.kills);
  return kills;
}

export const calcKP = (pKills: number, pAssists: number, tKills: number) => ((pKills + pAssists) / tKills).toFixed(2);