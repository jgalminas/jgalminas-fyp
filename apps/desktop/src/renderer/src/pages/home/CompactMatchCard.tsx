import { cn } from "@fyp/class-name-helper";
import { Match } from "@fyp/types"
import { Summoner, useSummoner } from "@renderer/SummonerContext";
import Card from "@renderer/core/Card";
import RoundImage from "@renderer/core/RoundImage";
import SquareImage from "@renderer/core/SquareImage";
import KDA from "@renderer/core/match/KDA";
import Stat from "@renderer/core/match/Stat";
import { Asset } from "@renderer/util/asset";
import { getPlayer } from "@renderer/util/match";
import { round } from "@renderer/util/number";
import { queue } from "@renderer/util/queue";
import { RoleIcons } from "@renderer/util/role";
import { aggregateTeamKills, calcCSPM, calcKDA, calcKP } from "@renderer/util/stats";
import { formatMatchLength, formatTimeAgo, timestampToMinutes } from "@renderer/util/time";
import { Link } from "react-router-dom";

export type CompactMatchCardProps = {
  match: Match
}

export const CompactMatchCard = ({ match }: CompactMatchCardProps) => {

  const { summoner } = useSummoner();
  const user = getPlayer(match, summoner as Summoner);

  const Role = user.position && RoleIcons[user.position];

  return (
    <Card data-test-id="recent-match-card" className={cn(
      "grid grid-cols-[min-content,min-content,0.8fr,0.6fr,1.9fr,minmax(0,1.3fr),1fr]",
      "items-center text-white p-0 gap-x-5"
    )}>
      <div className={cn(
        "w-2 min-w-[0.5rem] min-h-full rounded-l-lg row-span-3",
        match.winningTeam === user.team ? 'bg-accent-blue' : 'bg-accent-red'
      )}/>

      <div>
        { // @ts-expect-error
          user.position && <Role/>
        }
      </div>

      <div className="flex flex-col text-sm text-star-dust-300 py-5">
        <p className="font-bold"> { queue(match.queueId) } </p>
        <p> { formatTimeAgo(match.finish) } </p>
      </div>

      <div className="flex flex-col text-sm text-star-dust-300 py-5">
        <p className="font-bold"> { match.winningTeam === user.team ? 'Victory' : 'Defeat' } </p>
        <p aria-label="Match Duration"> { formatMatchLength(match.start, match.finish) } </p>
      </div>

      <div className="grid grid-cols-[auto,auto,1fr] grid-rows-2 gap-x-5 gap-y-0.5 items-center py-5">
        <div className="row-span-2 relative">
          <RoundImage alt={user.champion} className="h-11 w-11" src={Asset.champion(user.champion)}/>
          <p className="absolute translate-x-1 translate-y-1 bottom-0 right-0 bg-woodsmoke-50 text-center w-5 h-5 text-[0.625rem] rounded-full leading-[1.25rem]">
            { user.level }
          </p>
        </div>
        <KDA stats={{ kills: user.kills, assists: user.assists, deaths: user.deaths }}/>
        <Stat value={round(calcKDA({ kills: user.kills, assists: user.assists, deaths: user.deaths }))} type='KDA'/>
        <Stat value={calcKP(user.kills, user.assists, aggregateTeamKills(match.participants, user.team))} type='KP'/>
        <Stat value={`${user.cs} (${calcCSPM(user.cs, timestampToMinutes(match.finish - match.start))})`} type='CS'/>
      </div>

      <div className="flex flex-row py-5">
        <div className="grid grid-cols-2 gap-1.5">
          <SquareImage alt="primary rune" src={Asset.primaryRune(user.primaryRune)}/>
          <SquareImage alt="secondary rune" src={Asset.secondaryRune(user.secondaryRune)}/>
          <SquareImage alt="summoner spell one" src={Asset.summonerSpell(user.summonerOne)}/>
          <SquareImage alt="summoner spell two" src={Asset.summonerSpell(user.summonerTwo)}/>
        </div>
        <div className="grid grid-cols-3 grid-rows-2 gap-1.5 ml-3">
          { user.items.filter(i => i.slot !== 6).map((i) => {
            return (
              i._id !== 0
              ? <SquareImage alt={`item ${i.slot}`} key={i.slot} src={Asset.item(i._id)}/>
              : <div key={i.slot} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
        <div className="ml-1.5 self-center">
          {
            user.items[6]._id !== 0
            ? <SquareImage alt={`item 6`} src={Asset.item(user.items[6]._id)}/>
            : <div className="w-5 h-5 rounded bg-woodsmoke-200"/>
          }
        </div>
      </div>

      <div className="justify-self-end font-medium text-sm text-star-dust-200 align-middle">
        <Link className="pr-8" to={`/matches/${match._id}?champion=${user.champion}`}> View Details </Link>
      </div>

    </Card>
  )
}
