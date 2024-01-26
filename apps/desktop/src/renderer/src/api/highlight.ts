import { IHighlight } from "@fyp/types";
import { ClientRequestBuilder } from "@renderer/util/request";

export const getHighlights = async (
  filters?: {
    date?: string | number,
    champion?: string,
    role?: string,
    queue?: string | number,
    match?: string,
    start?: number
  }
): Promise<(IHighlight & { match: string })[]> => {

  const res = await new ClientRequestBuilder()
    .route('/v1/highlight/all')
    .query(filters)
    .fetch()

  return res.json();
}