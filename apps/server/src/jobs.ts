import { RegionGroups } from "twisted/dist/constants";
import { WSService, agenda, twisted } from "./app";
import { Job, JobAttributesData } from "agenda";
import { MatchRepository, RecordingRepository, SessionRepository } from "./repositories";
import { extractMatchData } from "./helpers/match";
import { AIService } from "./services/aiService";

export type MatchDataContract = {
  matchId: string,
  gameId: string,
  region: RegionGroups
} & JobAttributesData

export default () => {
  
  agenda.define<MatchDataContract>('GET_MATCH_DATA', async(job: Job<MatchDataContract>) => {

    const { matchId, region, gameId, userId, puuid } = job.attrs.data;
  
    const match = twisted.MatchV5.get(gameId, region);
    const timeline = twisted.MatchV5.timeline(gameId, region);

    try {
      const data = await Promise.all([match, timeline]);
      const result = await MatchRepository.insertMatch(matchId, extractMatchData(data[0].response, data[1].response));

      const sessions = (await SessionRepository.findSessionsByUserId(userId)).map((s => s._id.toString()));

      if (result) {
        WSService.send(sessions, {
          type: 'MATCH_UPLOADED',
          payload: {
            match: result,
          }
        })
        await job.remove();

        const recording = await RecordingRepository.findRecordingByMatchId(userId, matchId);
        const timeframes = await new AIService().getTimeframes({ puuid: puuid, match: result });

        if (recording) {
          WSService.send(sessions, {
            type: 'AI_HIGHLIGHTS',
            payload: {
              matchDuration: result.finish - result.start,
              recording: recording,
              timeframes: timeframes,
            }
          })
        }

      }

    } catch (err) {      
      job.fail('Failed to fetch/insert');
      job.schedule(new Date(Date.now() + (job.attrs.failCount ?? 1) * 2000))
    }
  
  });

}