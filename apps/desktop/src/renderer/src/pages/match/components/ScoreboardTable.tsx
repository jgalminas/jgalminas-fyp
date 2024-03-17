import { cn } from "@fyp/class-name-helper";
import { IParticipant, Match } from "@fyp/types";
import RoundImage from "@renderer/core/RoundImage";
import SquareImage from "@renderer/core/SquareImage";
import KDA from "@renderer/core/match/KDA";
import Stat from "@renderer/core/match/Stat";
import { Asset } from "@renderer/util/asset";
import { RoleIcons } from "@renderer/util/role";
import { aggregateTeamKills, calcCSPM, calcKDA, calcKP } from "@renderer/util/stats";
import { timestampToMinutes } from "@renderer/util/time";
import { Fragment } from "react";
import BannedChampion from "./BannedChampion";
import { getChampionIdByKey } from "@root/constants";
import { round } from "@renderer/util/number";

export type ScoreboardTableProps = {
  className?: string,
  match: Match
}

const ScoreboardTable = ({ className, match }: ScoreboardTableProps) => {

  const participants = match.participants.sort((a, b) => a.participantId > b.participantId ? 1 : -1);

  const blueTeam = participants.slice(0, 5);
  const redTeam = participants.slice(5, participants.length);
  const winner = (team: 'BLUE' | 'RED') => match.winningTeam === team ? 'WON' : 'LOST';

  return (
    <div className={cn("flex flex-col text-star-dust-300 text-sm", className)}>
      <div className="bg-woodsmoke-400 rounded-t-lg px-5 py-1.5 grid grid-cols-[1fr,4fr,1fr] items-center">
        <p className="text-star-dust-200 font-medium py-2.5"> Blue Team
          <span className={cn("ml-2", match.winningTeam === 'BLUE' ? "text-accent-green": "text-accent-red")}> { winner('BLUE') } </span>
        </p>
        <div className="flex gap-16 justify-center">
          <div className="flex gap-1.5">
            { match.bans && match.bans.BLUE.sort((a, b) => a.pickTurn > b.pickTurn ? -1 : 1).map((b) => {
              return (
                <BannedChampion key={b.championId} champion={getChampionIdByKey(b.championId)}/>
              )
            }) }
          </div>
          <div className="flex gap-1.5">
            { match.bans && match.bans.RED.sort((a, b) => a.pickTurn > b.pickTurn ? -1 : 1).map((b) => {
              return (
                <BannedChampion key={b.championId} champion={getChampionIdByKey(b.championId)}/>
              )
            }) }
          </div>
       </div>
        <p className="text-star-dust-200 font-medium justify-self-end py-2.5">
          <span className={cn("mr-2", match.winningTeam === 'RED' ? "text-accent-green": "text-accent-red")}> { winner('RED') } </span>
          Red Team
        </p>
      </div>
      <div className="grid grid-cols-[3fr,auto,3fr] items-center gap-5 bg-woodsmoke-700 rounded-b-lg p-5">
        {
          Array.from({ length: 5 }).map((_, i) => {
            const pos = blueTeam[i].position;
            const Position = pos ? RoleIcons[pos] : null;
            return (
              <Fragment key={i}>
                <Player player={blueTeam[i]} start={match.start} finish={match.finish} teamKills={aggregateTeamKills(match.participants, 'BLUE')}/>
                { //@ts-expect-error
                  pos && <Position className="mx-1 2xl:mx-5"/>
                }
                <Player inverse player={redTeam[i]} start={match.start} finish={match.finish} teamKills={aggregateTeamKills(match.participants, 'RED')}/>
              </Fragment>
            )
          })
        }
      </div>
    </div>
  )
}

type PlayerProps = {
  player: IParticipant,
  teamKills: number,
  start: number,
  finish: number,
  inverse?: boolean
}

const Player = ({ player, inverse = false, teamKills, start, finish }: PlayerProps) => {

  const trinket = player.items[player.items.length - 1];
  return (
    <div className={cn(
      "grid grid-cols-[2.1fr,2.5fr] 2xl:grid-cols-[2.1fr,2.5fr,auto] gap-x-5",
      inverse && "grid-cols-[2.5fr,2.1fr] 2xl:grid-cols-[auto,2.5fr,2.1fr]"
    )}>
      <div className={cn(
        "grid grid-cols-[3rem,1fr] grid-rows-2 gap-x-3 items-center text-sm",
        inverse && "grid-cols-[1fr,3rem] order-3"
      )}>
        <RoundImage alt={player.champion} className={cn("row-span-2 w-full h-full", inverse && "col-start-2 row-start-1",
        player.team === "BLUE" ? "border-accent-blue" : "border-accent-red")}
        src={Asset.champion(player.champion)}/>
        <p className={cn("text-star-dust-200 max-w-24 truncate", inverse && "place-self-end")}> { player.username } </p>
        <p className={cn("text-start-dust-400", inverse && "place-self-end")}> { player.champion } </p>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-4", inverse && "order-2 justify-items-end")}>
        <Stat value={round(calcKDA({ kills: player.kills, assists: player.assists, deaths: player.deaths }))} type='KDA'/>
        <KDA stats={{ kills: player.kills, assists: player.assists, deaths: player.deaths }}/>
        <Stat value={`${player.cs} (${calcCSPM(player.cs, timestampToMinutes(finish - start))})`} type='CS'/>
        <Stat value={calcKP(player.kills, player.assists, teamKills)} type='KP'/>
      </div>

      <div className={cn(
        "col-span-full 2xl:col-start-3 flex gap-3 items-center mt-4 2xl:mt-0",
        inverse && "flex-row-reverse 2xl:col-start-1 2xl:col-end-2 order-3 2xl:order-1"
      )}>
        <div className="flex 2xl:grid 2xl:grid-cols-2 2xl:grid-rows-2 gap-1.5">
          <SquareImage alt="primary rune" src={Asset.primaryRune(player.primaryRune)}/>
          <SquareImage alt="secondary rune" className="p-0.5" src={Asset.secondaryRune(player.secondaryRune)}/>
          <SquareImage alt="summoner spell one" src={Asset.summonerSpell(player.summonerOne)}/>
          <SquareImage alt="summoner spell two" src={Asset.summonerSpell(player.summonerTwo)}/>
        </div>
        <div className="flex 2xl:grid 2xl:grid-cols-3 gap-1.5">
          { player.items.slice(0, player.items.length - 1).map((i) => {
            return (
              i._id !== 0
              ? <SquareImage alt={`Item ${i.slot}`} key={i.slot} src={Asset.item(i._id)}/>
              : <div key={i.slot} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
        <div>
          {
            trinket._id !== 0
            ? <SquareImage alt="trinket" src={Asset.item(trinket._id)}/>
            : <div className="w-5 h-5 rounded bg-woodsmoke-200"/>
          }
        </div>
      </div>
    </div>
  )
}

export default ScoreboardTable;
