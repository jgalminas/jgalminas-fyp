
export type GameType = typeof GAME_TYPE[number];
export type GameMode = typeof GAME_MODE[number];
export type Team = typeof TEAM[number];
export type Position = typeof POSITION[number];
export type SummonerSpell = typeof SUMMONER_SPELL[number];
export type EventType = typeof EVENT_TYPE[number];
export type Lane = typeof LANE[number];
export type Building = typeof BUILDING[number];
export type SpecialKillType = typeof SPECIAL_KILL_TYPE[number];
export type Monster = typeof MONSTER[number];
export type QueueType = typeof QUEUE[number];

export const POSITION = ['TOP', 'JUNGLE', 'MID', 'BOTTOM', 'SUPPORT'] as const;
export const GAME_TYPE = ['CLASSIC'] as const;
export const GAME_MODE = ['MATCHED_GAME'] as const;
export const TEAM = ['RED', 'BLUE'] as const;
export const SUMMONER_SPELL = [21, 1, 14, 3, 4, 6, 7, 13, 11, 12] as const;
export const EVENT_TYPE = ['CHAMPION_KILL', 'ELITE_MONSTER_KILL', 'BUILDING_KILL', 'TURRET_PLATE_DESTROYED', 'CHAMPION_SPECIAL_KILL'] as const;
export const LANE = ['TOP_LANE', 'BOT_LANE', 'MID_LANE'] as const;
export const BUILDING = ['TOWER_BUILDING', 'INHIBITOR_BUILDING'] as const;
export const SPECIAL_KILL_TYPE = ['KILL_ACE', 'KILL_FIRST_BLOOD', 'KILL_MULTI'] as const;
export const MONSTER = ['DRAGON', 'RIFTHERALD', 'BARON_NASHOR'] as const;
export const  QUEUE = [
  400, // Normal Draft
  420, // Ranked Solo/Duo
  430, // Normal Blind
  440 // Ranked Flex
] as const;