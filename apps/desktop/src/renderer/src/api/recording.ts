import { IRecording } from "@fyp/types";
import { RequestBuilder } from "@renderer/util/request";

export const getRecordings = async (
  filters: {
    date: string | number,
    champion: string,
    role: string,
    queue: string | number
  }
): Promise<(IRecording & { match: string })[]> => {

  const res = await new RequestBuilder()
    .route('/v1/recording/all')
    .query(filters)
    .fetch()

  return res.json();
}