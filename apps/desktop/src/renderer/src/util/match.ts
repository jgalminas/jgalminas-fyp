import { Match } from "@fyp/types";
import { Session } from "@renderer/auth/AuthContext";

export const player = (match: Match, session: Session) => match.participants.find(p => p.puuid === session?.puuid) as Match['participants'][number];