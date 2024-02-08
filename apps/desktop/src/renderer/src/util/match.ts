import { Match, MatchWithGoldFrames } from "@fyp/types";
import { Summoner } from "@renderer/SummonerContext";

export const getPlayer = (match: Match | MatchWithGoldFrames, summoner: Summoner) => match.participants.find(p => p.puuid === summoner?.puuid) as Match['participants'][number];