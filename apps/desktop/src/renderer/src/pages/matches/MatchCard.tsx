import { cn } from "@fyp/class-name-helper";
import { Match } from "@fyp/types";
import Card from "@renderer/core/Card";
import RoundImage from "@renderer/core/RoundImage";
import Stat from "@renderer/core/match/Stat";
import KDA from "@renderer/core/match/KDA";
import { Asset } from "@renderer/util/asset";
import { RoleIcons } from "@renderer/util/role";
import { formatMatchLength, formatTimeAgo, timestampToMinutes } from "@renderer/util/time";
import { Link } from "react-router-dom";
import { aggregateTeamKills, calcCSPM, calcKDA, calcKP } from "@renderer/util/stats";
import SquareImage from "@renderer/core/SquareImage";


export type MatchCardProps = {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {

  const player = match.participants[0];
  player.items.sort((a, b) => a.slot > b.slot ? 1 : -1);

  const Position = RoleIcons[player.position];

  return (
    <Card className="grid grid-cols-[auto,auto,0.7fr,2.2fr,1.2fr,0.9fr] items-center grid-rows-[auto,auto] text-white p-0 gap-y-2.5 gap-x-5">
      <div className={cn(
        "w-2 min-w-[0.5rem] min-h-full rounded-l-lg row-span-2",
        match.winningTeam === player.team ? 'bg-accent-blue' : 'bg-accent-red'
      )}/>
      
      <div className="pt-2.5">
        <Position/>
      </div>

      <div className="col-start-3 row-start-1 flex flex-col text-sm text-star-dust-300 pt-5">
        <p className="font-bold"> Normal </p>
        <p> { formatTimeAgo(match.finish) } </p>
      </div>

      <div className="col-start-3 row-start-2 flex flex-col text-sm text-star-dust-300 self-start pb-5">
        <p className="font-bold"> { match.winningTeam === player.team ? 'Victory' : 'Defeat' } </p>
        <p> { formatMatchLength(match.start, match.finish) } </p>
      </div>

      <div className="grid grid-cols-[auto,auto,1fr] col-start-4 grid-rows-2 gap-x-5 gap-y-0.5 items-center pt-5">
        <div className="row-span-2 relative">
          <RoundImage className="h-11 w-11" src={Asset.champion(player.champion)}/>
          <p className="absolute translate-x-1 translate-y-1 bottom-0 right-0 bg-woodsmoke-50 text-center w-5 h-5 text-[0.625rem] rounded-full leading-[1.25rem]">
            { player.level }
          </p>
        </div>
        <KDA stats={{ kills: player.kills, assists: player.assists, deaths: player.deaths }}/>
        <Stat value={calcKDA({ kills: player.kills, assists: player.assists, deaths: player.deaths })} type='KDA'/>
        <Stat value={calcKP(player.kills, player.assists, aggregateTeamKills(match.participants, player.team))} type='KP'/>
        <Stat value={`${player.cs} (${calcCSPM(player.cs, timestampToMinutes(match.finish - match.start))})`} type='CS'/>
      </div>

      <div className="col-start-4 row-start-2 grid grid-cols-[auto,1fr] self-start gap-x-5 mt-1">
        <div className="col-start-1 flex mr-3 gap-1.5">
          <SquareImage src={Asset.summonerSpell(player.summonerOne)}/>
          <SquareImage src={Asset.summonerSpell(player.summonerTwo)}/>
          <SquareImage className="ml-1.5" src={Asset.summonerSpell(player.summonerOne)}/>
          <SquareImage src={Asset.summonerSpell(player.summonerTwo)}/>
        </div>
        <div className="col-start-2 flex gap-1.5">
          { Array.from({ length: 6 }).map((_, i) => {
            const item = player.items[i];
            return (
              item
              ? <SquareImage key={i} src={Asset.item(item._id)}/>
              : <div key={i} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
      </div>

      <div className="grid grid-cols-2 row-span-2 py-5">
        <div className="flex flex-col gap-1">
          { match.participants.filter(p => p.team === player.team).map((p) => {
            return (
              <div className="flex items-center gap-2" key={p.username}>
                <SquareImage src={Asset.champion(p.champion)}/>
                <p className="text-star-dust-300 text-xs max-w-[3rem] truncate"> { p.username } </p>
              </div>
            )
          }) }
        </div>
        <div className="col-start-2 flex items-end flex-col gap-1">
          { match.participants.filter(p => p.team !== player.team).map((p) => {
            return (
              <div className="flex items-center gap-2" key={p.username}>
                <p className="text-star-dust-300 text-xs max-w-[3rem] truncate"> { p.username } </p>
                <SquareImage src={Asset.champion(p.champion)}/>
              </div>
            )
          }) }
        </div>
      </div>

      <div className="row-span-2 col-start-6 font-medium text-sm text-star-dust-200 align-middle justify-self-center">
        <Link to='/matches'> View Details </Link>
      </div>

    </Card>
  )
}

export default MatchCard;

