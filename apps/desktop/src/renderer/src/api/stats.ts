import { AverageStats, ChampionStats } from "@fyp/types";
import { ClientRequestBuilder } from "@renderer/util/request";

export const getSummary = async (): Promise<AverageStats> => {
  const res = await new ClientRequestBuilder()
    .route('/v1/stats/summary')
    .fetch();

  return await res.json();
}

export const getChampionStats = async (): Promise<ChampionStats[]> => {
  const res = await new ClientRequestBuilder()
    .route('/v1/stats/champions')
    .fetch();

  return await res.json();
}