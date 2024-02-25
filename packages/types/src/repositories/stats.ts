
export type ChampionStats = {
  champion: string,
  totalMatches: number,
  totalWins: number,
  totalKills: number,
  totalDeaths: number,
  totalAssists: number,
  winRate: number,
  kda: number
}

export type AverageStats = {
  totalMatches: number,
  totalWins: number,
  avgKills: number,
  avgDeaths: number,
  avgAssists: number,
  kda: number
}