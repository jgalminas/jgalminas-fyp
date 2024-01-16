import { Match } from "@fyp/types";
import { RequestBuilder } from "@renderer/util/request"

export const getMatchById = async (id: string): Promise<Match> => {
  const res = await new RequestBuilder()
    .route(`/v1/match/${id}`)
    .fetch();

  return await res.json();
}

export const getMatches = async (): Promise<Match[]> => {
  const res = await new RequestBuilder()
  .route('/v1/match/all')
  .fetch();

  return res.json();
}