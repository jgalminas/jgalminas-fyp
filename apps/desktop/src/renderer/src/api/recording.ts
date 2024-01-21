import { IRecording } from "@fyp/types";
import { ClientRequestBuilder } from "@renderer/util/request";

export const getRecordings = async (
  filters: {
    date: string | number,
    champion: string,
    role: string,
    queue: string | number
  }
): Promise<(IRecording & { match: string })[]> => {

  const res = await new ClientRequestBuilder()
    .route('/v1/recording/all')
    .query(filters)
    .fetch()

  return res.json();
}

export const getRecording = async (id: string): Promise<IRecording & { match: string }> => {
  const res = await new ClientRequestBuilder()
  .route('/v1/recording/', id)
  .fetch();

  return res.json();
} 