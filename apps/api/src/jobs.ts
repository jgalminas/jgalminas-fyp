import { RegionGroups } from "twisted/dist/constants";
import { agenda, twisted } from "./app";
import { Job, JobAttributesData } from "agenda";
import { MatchRepository, RecordingRepository } from "@fyp/db";
import { extractMatchData } from "./helpers/match";

export type MatchDataContract = {
  matchId: string,
  region: RegionGroups
} & JobAttributesData

export default () => {
  
  agenda.define<MatchDataContract>('GET_MATCH_DATA', async(job: Job<MatchDataContract>) => {

    const { matchId, region } = job.attrs.data;
  
    const match = twisted.MatchV5.get(matchId, region);
    const timeline = twisted.MatchV5.timeline(matchId, region);
    
    try {
      const data = await Promise.all([match, timeline]);
      await MatchRepository.insertMatch(extractMatchData(data[0].response, data[1].response));
      await job.remove();
  
    } catch (err) {
      job.fail('Failed to fetch/insert');
      job.schedule(new Date(Date.now() + (job.attrs.failCount ?? 1) * 2000))
    }
  
  });

}