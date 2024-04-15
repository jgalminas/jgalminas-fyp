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
import { queue } from "@renderer/util/queue";
import { getPlayer } from "@renderer/util/match";
import { Summoner, useSummoner } from "@renderer/SummonerContext";
// import { WithTooltip } from "@renderer/core/WithTooltip";
// import { UsernameTooltip } from "@renderer/core/tooltips/UsernameTooltip";
import { round } from "@renderer/util/number";


export type MatchCardProps = {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {

  const { summoner } = useSummoner();
  const user = getPlayer(match, summoner as Summoner);
  user.items.sort((a, b) => a.slot > b.slot ? 1 : -1);

  const Role = user.position && RoleIcons[user.position];

  return (
    <Card data-test-id="match-card" className={cn(
      "grid grid-cols-[min-content,min-content,auto] gap-y-4",
      "2lg:grid-cols-[min-content,min-content,auto,0.9fr] 2lg:gap-y-2.5",
      "xl:grid-cols-[min-content,min-content,0.75fr,2.2fr,minmax(0,1.2fr),0.9fr]",
      "items-center grid-rows-[auto,auto] text-white p-0 gap-x-5"
    )}>
      <div className={cn(
        "w-2 mr-5 2lg:mr-0 min-w-[0.5rem] min-h-full rounded-l-lg row-span-3",
        match.winningTeam === user.team ? 'bg-accent-blue' : 'bg-accent-red'
      )}/>

      <div className="pt-5 2lg:pt-2.5">
        { // @ts-expect-error
          user.position && <Role/>
        }
      </div>

      <div className="col-start-3 row-start-1 flex flex-col text-sm text-star-dust-300 pt-5">
        <p className="font-bold"> { queue(match.queueId) } </p>
        <p> { formatTimeAgo(match.finish) } </p>
      </div>

      <div className="col-start-4 pt-5 2lg:pt-0 col-end-5 row-start-1 2lg:col-start-3 2lg:row-start-2 flex flex-col text-sm text-star-dust-300 self-start 2lg:pb-5">
        <p className="font-bold"> { match.winningTeam === user.team ? 'Victory' : 'Defeat' } </p>
        <p aria-label="Match Duration"> { formatMatchLength(match.start, match.finish) } </p>
      </div>

      <div className="col-start-2 col-end-6 row-start-2 2lg:row-start-1 grid grid-cols-[auto,auto,1fr] 2lg:col-start-4 2lg:col-end-5 grid-rows-2 gap-x-5 gap-y-0.5 items-center 2lg:pt-5">
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

      <div className="col-start-2 col-end-6 row-start-3 2lg:col-start-4 2lg:col-end-5 2lg:row-start-2 self-start mt-1 flex flex-row 2lg:flex-col 1.5xl:flex-row gap-3 1.5xl:gap-5 pb-5">
        <div className="col-start-1 flex mr-3 gap-1.5">
          <SquareImage alt="primary rune" src={Asset.primaryRune(user.primaryRune)}/>
          <SquareImage alt="secondary rune" className="p-0.5" src={Asset.secondaryRune(user.secondaryRune)}/>
          <SquareImage alt="summoner spell one" className="ml-1.5" src={Asset.summonerSpell(user.summonerOne)}/>
          <SquareImage alt="summoner spell two" src={Asset.summonerSpell(user.summonerTwo)}/>
        </div>
        <div className="col-start-2 flex gap-1.5 pr-3">
          { user.items.map((i) => {
            return (
              i._id !== 0
              ? <SquareImage alt={`item ${i.slot}`} key={i.slot} src={Asset.item(i._id)}/>
              : <div key={i.slot} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
      </div>

      <div className="hidden xl:grid grid-cols-2 row-span-2 py-5">
        <div className="flex flex-col gap-1">
          { match.participants.filter(p => p.team === user.team).sort((a, b) => a.participantId > b.participantId ? 1 : -1).map((p) => {
            return (
              <div className="flex items-center gap-2" key={p.username}>
                <SquareImage alt={p.champion} src={Asset.champion(p.champion)}/>
                {/* <WithTooltip tooltip={<UsernameTooltip username={p.username} tag={p.tag}/>}> */}
                  <p className="text-star-dust-300 text-xs max-w-[3rem] truncate"> { p.username } </p>
                {/* </WithTooltip> */}
              </div>
            )
          }) }
        </div>
        <div className="col-start-2 flex items-end flex-col gap-1">
          { match.participants.filter(p => p.team !== user.team).sort((a, b) => a.participantId > b.participantId ? 1 : -1).map((p) => {
            return (
              <div className="flex items-center gap-2" key={p.username}>
                {/* <WithTooltip tooltip={<UsernameTooltip username={p.username} tag={p.tag}/>}> */}
                  <p className="text-star-dust-300 text-xs max-w-[3rem] truncate"> { p.username } </p>
                {/* </WithTooltip> */}
                <SquareImage alt={p.champion} src={Asset.champion(p.champion)}/>
              </div>
            )
          }) }
        </div>
      </div>

      <div className="row-span-3 2lg:row-span-2 col-start-6 font-medium text-sm text-star-dust-200 align-middle justify-self-center pr-5">
        <Link to={`/matches/${match._id}?champion=${user.champion}`}> View Details </Link>
      </div>

    </Card>
  )
}

export default MatchCard;

