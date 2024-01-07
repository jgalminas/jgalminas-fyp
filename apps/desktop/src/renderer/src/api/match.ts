import { Match } from "@fyp/types";
import { api } from "@renderer/util/api"

export const getMatchById = async (id: string): Promise<Match> => {
  const res = await fetch(api(`/v1/match/${id}`), {
    credentials: 'include'
  })
  return await res.json();
}

export const getMatches = async (): Promise<Match[]> => {
  const res = await fetch(api('/v1/match/list'), {
    credentials: 'include'
  })

  return res.json();
}