import { Match } from "@fyp/types";
import { RequestBuilder } from "@renderer/util/request"

export const getMatchById = async (id: string): Promise<Match> => {
  const res = await new RequestBuilder()
    .route(`/v1/match/${id}`)
    .fetch();

  return await res.json();
}

export const getMatches = async (
  filters: {
    date: string | number,
    champion: string,
    role: string,
    queue: string | number
  }
): Promise<Match[]> => {
  const res = await new RequestBuilder()
  .route('/v1/match/all')
  .query(filters)
  .fetch();

  return res.json();
}