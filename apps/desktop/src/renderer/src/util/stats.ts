import { IMatch } from "@fyp/types"
import { round } from "./number"

export type Stats = {
  kills: number,
  deaths: number,
  assists: number
}

export const calcKDA = (stats: Stats) => {
  return stats.deaths === 0 ? round(stats.kills + stats.assists) : round((stats.kills + stats.assists) / stats.deaths)
}

export const aggregateTeamKills = (participants: IMatch['participants'], team: IMatch['participants'][number]['team']) => {
  let kills = 0;
  participants.filter(p => p.team === team).forEach((p) => kills += p.kills);
  return kills;
}

export const calcKP = (pKills: number, pAssists: number, tKills: number) => round((((pKills + pAssists) / tKills) * 100)) + '%';

export const calcCSPM = (cs: number, gameDuration: number) => round(cs / gameDuration);