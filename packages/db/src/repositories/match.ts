import { IMatch } from "../schema";
import { Match } from "../schema/match";

export const insertMatch = async(data: IMatch) => {
  const match = await Match.create(data);
  await match.save();
  return match;
} 