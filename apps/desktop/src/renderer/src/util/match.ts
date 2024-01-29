import { Match } from "@fyp/types";
import { Summoner } from "@renderer/SummonerContext";

export const player = (match: Match, summoner: Summoner) => match.participants.find(p => p.puuid === summoner?.puuid) as Match['participants'][number];