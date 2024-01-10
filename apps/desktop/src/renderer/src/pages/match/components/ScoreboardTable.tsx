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

export type ScoreboardTableProps = {
  match: Match
}

const ScoreboardTable = ({ match }: ScoreboardTableProps) => {

  const participants = match.participants.sort((a, b) => a.participantId > b.participantId ? 1 : -1);

  const blueTeam = participants.slice(0, 5);
  const redTeam = participants.slice(5, participants.length);
  const winner = (team: 'BLUE' | 'RED') => match.winningTeam === team ? 'Won' : 'Lost';

  return (
    <div className="flex flex-col text-star-dust-300 text-sm">
      <div className="bg-woodsmoke-400 rounded-t-lg px-5 py-1.5 grid grid-cols-[1fr,4fr,1fr] items-center">
        <p className="text-star-dust-200 font-medium"> BLUE TEAM
          <span className={cn("ml-2", match.winningTeam === 'BLUE' ? "text-accent-green": "text-accent-red")}> { winner('BLUE') } </span>
        </p>
        <div className="flex gap-16 justify-center">
          <div className="flex gap-1.5">
            {
              blueTeam.map((p) => (<BannedChampion champion={p.champion}/>))
            }
          </div>
          <div className="flex gap-1.5">
            {
              redTeam.map((p) => (<BannedChampion champion={p.champion}/>))
            } 
          </div>
       </div>
        <p className="text-star-dust-200 font-medium justify-self-end"> 
          <span className={cn("mr-2", match.winningTeam === 'RED' ? "text-accent-green": "text-accent-red")}> { winner('RED') } </span>
          RED TEAM
        </p>
      </div>
      <div className="grid grid-cols-[3fr,auto,3fr] items-center gap-5 bg-woodsmoke-700 rounded-b-lg p-5">
        {
          Array.from({ length: 5 }).map((_, i) => {
            const Position = RoleIcons[blueTeam[i].position];
            return (
              <Fragment>
                <Player player={blueTeam[i]} start={match.start} finish={match.finish} teamKills={aggregateTeamKills(match.participants, 'BLUE')}/>
                <Position className="mx-5"/>
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
    <div className={cn("grid grid-cols-[2.1fr,2.5fr,auto] gap-x-5", inverse && "grid-cols-[auto,2.5fr,2.1fr]")}>
      <div className={cn("grid grid-cols-[3rem,1fr] grid-rows-2 gap-x-3 items-center text-sm", inverse && "grid-cols-[1fr,3rem] order-3")}>
        <RoundImage className={cn("row-span-2 w-full h-full", inverse && "col-start-2 row-start-1")} src={Asset.champion(player.champion)}/>
        <p className={cn("text-star-dust-200 max-w-24 truncate", inverse && "place-self-end")}> { player.username } </p>
        <p className={cn("text-start-dust-400", inverse && "place-self-end")}> { player.champion } </p>
      </div>

      <div className={cn("grid grid-cols-2 gap-x-4", inverse && "order-2 justify-items-end")}>
        <Stat value={calcKDA({ kills: player.kills, assists: player.assists, deaths: player.deaths })} type='KDA'/>
        <KDA stats={{ kills: player.kills, assists: player.assists, deaths: player.deaths }}/>
        <Stat value={`${player.cs} (${calcCSPM(player.cs, timestampToMinutes(finish - start))})`} type='CS'/>
        <Stat value={calcKP(player.kills, player.assists, teamKills)} type='KP'/>
      </div>

      <div className={cn("flex gap-3 items-center", inverse && "flex-row-reverse")}>
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5">
          <SquareImage src={Asset.summonerSpell(player.summonerOne)}/>
          <SquareImage src={Asset.summonerSpell(player.summonerTwo)}/>
          <SquareImage src={Asset.summonerSpell(player.summonerOne)}/>
          <SquareImage src={Asset.summonerSpell(player.summonerTwo)}/>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          { player.items.slice(0, player.items.length - 1).map((i) => {
            return (
              i._id !== 0
              ? <SquareImage key={i.slot} src={Asset.item(i._id)}/>
              : <div key={i.slot} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
        <div>
          {
            trinket._id !== 0
            ? <SquareImage src={Asset.item(trinket._id)}/>
            : <div className="w-5 h-5 rounded bg-woodsmoke-200"/>
          }
        </div>
      </div>
    </div>
  )
}

export default ScoreboardTable;