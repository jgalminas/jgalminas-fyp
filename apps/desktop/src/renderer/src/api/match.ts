import { AggregatedEvents, Match } from "@fyp/types";
import { ClientRequestBuilder } from "@renderer/util/request";

export const getMatchById = async (id: string): Promise<Match> => {
  const res = await new ClientRequestBuilder()
    .route(`/v1/match/${id}`)
    .fetch();

  return await res.json();
}

export const getMatches = async (
  filters: {
    date?: string | number,
    champion?: string,
    role?: string,
    queue?: string | number,
    start?: number,
    offset?: number
  }
): Promise<Match[]> => {
  const res = await new ClientRequestBuilder()
  .route('/v1/match/all')
  .query(filters)
  .fetch();

  return res.json();
}

export const getMatchEvents = async (id: string): Promise<AggregatedEvents> => {
  const res = await new ClientRequestBuilder()
  .route(`/v1/match/${id}/events`)
  .fetch();

  return res.json();
}
