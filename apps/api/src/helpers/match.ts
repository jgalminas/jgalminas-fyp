import { GameMode, GameType, QueueType, Position, SummonerSpell, CreateEvent, Monster, Lane, Building, SpecialKillType } from "@fyp/types";
import { InsertMatch } from '@fyp/db';
import { MatchV5DTOs, MatchV5TimelineDTOs } from "twisted/dist/models-dto";

export const extractMatchData = (match: MatchV5DTOs.MatchDto, timeline: MatchV5TimelineDTOs.MatchTimelineDto): InsertMatch => {

  const teamColour = (id: number) => id === 100 ? 'BLUE' : 'RED';

  const bans = () => {
    const bans: {
      'BLUE': { pickTurn: number, championId: number }[],
      'RED': { pickTurn: number, championId: number }[]
    } = {
      'BLUE': [],
      'RED': []
    };
    match.info.teams.forEach((t) => {
      if (t.bans) {
        bans[teamColour(t.teamId)] = t.bans;
      }  
    })
    return Object.keys(bans).length > 0 ? bans : undefined;
  }

  const filterEvents = (events: MatchV5TimelineDTOs.Frame['events']): CreateEvent[] => {

    const filtered: CreateEvent[] = [];

    events.forEach((e) => {

      switch (e.type) {
        case 'CHAMPION_KILL':
          filtered.push({
            type: e.type,
            timestamp: e.timestamp,
            killerId: e.killerId as number,
            victimId: e.victimId as number,
            assistingParticipantIds: e.assistingParticipantIds ?? []
          })
          break;
        case 'ELITE_MONSTER_KILL':
          filtered.push({
            type: e.type,
            timestamp: e.timestamp,
            killerId: e.killerId as number,
            monsterType: e.monsterType as Monster,
            assistingParticipantIds: e.assistingParticipantIds ?? []
          })
          break;
        case 'BUILDING_KILL':
          filtered.push({
            type: e.type,
            killerId: e.killerId as number,
            timestamp: e.timestamp,
            lane: e.laneType as Lane,
            buildingType: e.buildingType as Building,
            assistingParticipantIds: e.assistingParticipantIds ?? []
          })
          break;
        case 'TURRET_PLATE_DESTROYED':
          filtered.push({
            type: e.type,
            timestamp: e.timestamp,
            killerId: e.killerId as number,
            lane: e.laneType as Lane,
          })
          break;
        case 'CHAMPION_SPECIAL_KILL':
          filtered.push({
            type: e.type,
            timestamp: e.timestamp,
            killerId: e.killerId as number,
            multiKillLength: e.multiKillLength ?? 1,
            killType: e.killType as SpecialKillType
          })
          break;
      }

    })

    return filtered;
  }

  return {
    gameId: match.metadata.matchId,
    queueId: match.info.queueId as QueueType,
    start: match.info.gameStartTimestamp,
    // @ts-ignore
    finish: match.info.gameEndTimestamp as number,
    patch: match.info.gameVersion,
    mode: match.info.gameMode as GameMode,
    type: match.info.gameType as GameType,
    winningTeam: teamColour(match.info.teams[0].win === true ? match.info.teams[0].teamId : match.info.teams[1].teamId),
    participants: match.info.participants.map((p) => ({
      puuid: p.puuid,
      champion: p.championName,
      // @ts-ignore
      username: p.riotIdGameName,
      tag: p.riotIdTagline,
      participantId: p.participantId,
      position: p.teamPosition as Position,
      team: teamColour(p.teamId),
      summonerOne: p.summoner1Id as SummonerSpell,
      summonerTwo: p.summoner2Id as SummonerSpell,
      primaryRune: p.perks.styles[0].style,
      secondaryRune: p.perks.styles[1].style,
      items: [
        { _id: p.item0, slot: 0 },
        { _id: p.item1, slot: 1 },
        { _id: p.item2, slot: 2 },
        { _id: p.item3, slot: 3 },
        { _id: p.item4, slot: 4 },
        { _id: p.item5, slot: 5 },
        { _id: p.item6, slot: 6 }
      ],
      kills: p.kills,
      assists: p.assists,
      deaths: p.deaths,
      cs: p.totalMinionsKilled + p.neutralMinionsKilled,
      level: p.champLevel
    })),
    bans: bans(),
    frames: timeline.info.frames.map((f) => ({
      timestamp: f.timestamp,
      participantStats: Object.values(f.participantFrames).map((pf) => ({
        participantId: pf.participantId,
        totalGold: pf.totalGold,
        level: pf.level,
        jungleMinionsKilled: pf.jungleMinionsKilled,
        minionsKilled: pf.minionsKilled,
        magicDamageDone: pf.damageStats.magicDamageDone,
        magicDamageToChampions: pf.damageStats.magicDamageDoneToChampions,
        magicDamageTaken: pf.damageStats.magicDamageTaken,
        physicalDamageDone: pf.damageStats.physicalDamageDone,
        physicalDamageToChampions: pf.damageStats.physicalDamageDoneToChampions,
        physicalDamageTaken: pf.damageStats.physicalDamageTaken,
        trueDamageDone: pf.damageStats.trueDamageDone,
        trueDamageToChampions: pf.damageStats.trueDamageDoneToChampions,
        trueDamageTaken: pf.damageStats.trueDamageTaken
      })),
      events: filterEvents(f.events)
    }))
  }
}