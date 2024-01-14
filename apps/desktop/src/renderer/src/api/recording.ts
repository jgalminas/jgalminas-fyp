import { IRecording } from "@fyp/types";
import { api } from "@renderer/util/api";

export const getRecordings = async (): Promise<(IRecording & { match: string })[]> => {
  const res = await fetch(api('/v1/recording/all'), {
    credentials: 'include'
  })

  return res.json();
}