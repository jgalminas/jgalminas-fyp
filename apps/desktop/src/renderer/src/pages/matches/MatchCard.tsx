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
import { WithTooltip } from "@renderer/core/WithTooltip";
import { UsernameTooltip } from "@renderer/core/tooltips/UsernameTooltip";


export type MatchCardProps = {
  match: Match
}

const MatchCard = ({ match }: MatchCardProps) => {

  const { summoner } = useSummoner();
  const user = getPlayer(match, summoner as Summoner);
  user.items.sort((a, b) => a.slot > b.slot ? 1 : -1);

  const Role = user.position && RoleIcons[user.position];

  return (
    <Card className="grid grid-cols-[auto,auto,0.7fr,2.2fr,1.2fr,0.9fr] items-center grid-rows-[auto,auto] text-white p-0 gap-y-2.5 gap-x-5">
      <div className={cn(
        "w-2 min-w-[0.5rem] min-h-full rounded-l-lg row-span-2",
        match.winningTeam === user.team ? 'bg-accent-blue' : 'bg-accent-red'
      )}/>
      
      <div className="pt-2.5">
        { // @ts-expect-error
          user.position && <Role/>
        }
      </div>

      <div className="col-start-3 row-start-1 flex flex-col text-sm text-star-dust-300 pt-5">
        <p className="font-bold"> { queue(match.queueId) } </p>
        <p> { formatTimeAgo(match.finish) } </p>
      </div>

      <div className="col-start-3 row-start-2 flex flex-col text-sm text-star-dust-300 self-start pb-5">
        <p className="font-bold"> { match.winningTeam === user.team ? 'Victory' : 'Defeat' } </p>
        <p> { formatMatchLength(match.start, match.finish) } </p>
      </div>

      <div className="grid grid-cols-[auto,auto,1fr] col-start-4 grid-rows-2 gap-x-5 gap-y-0.5 items-center pt-5">
        <div className="row-span-2 relative">
          <RoundImage className="h-11 w-11" src={Asset.champion(user.champion)}/>
          <p className="absolute translate-x-1 translate-y-1 bottom-0 right-0 bg-woodsmoke-50 text-center w-5 h-5 text-[0.625rem] rounded-full leading-[1.25rem]">
            { user.level }
          </p>
        </div>
        <KDA stats={{ kills: user.kills, assists: user.assists, deaths: user.deaths }}/>
        <Stat value={calcKDA({ kills: user.kills, assists: user.assists, deaths: user.deaths })} type='KDA'/>
        <Stat value={calcKP(user.kills, user.assists, aggregateTeamKills(match.participants, user.team))} type='KP'/>
        <Stat value={`${user.cs} (${calcCSPM(user.cs, timestampToMinutes(match.finish - match.start))})`} type='CS'/>
      </div>

      <div className="col-start-4 row-start-2 grid grid-cols-[auto,1fr] self-start gap-x-5 mt-1">
        <div className="col-start-1 flex mr-3 gap-1.5">
          <SquareImage src={Asset.primaryRune(user.primaryRune)}/>
          <SquareImage className="p-0.5" src={Asset.secondaryRune(user.secondaryRune)}/>
          <SquareImage className="ml-1.5" src={Asset.summonerSpell(user.summonerOne)}/>
          <SquareImage src={Asset.summonerSpell(user.summonerTwo)}/>
        </div>
        <div className="col-start-2 flex gap-1.5">
          { user.items.map((i) => {
            return (
              i._id !== 0
              ? <SquareImage key={i.slot} src={Asset.item(i._id)}/>
              : <div key={i.slot} className="w-5 h-5 rounded bg-woodsmoke-200"/>
            )
          }) }
        </div>
      </div>

      <div className="grid grid-cols-2 row-span-2 py-5">
        <div className="flex flex-col gap-1">
          { match.participants.filter(p => p.team === user.team).sort((a, b) => a.participantId > b.participantId ? 1 : -1).map((p) => {
            return (
              <div className="flex items-center gap-2" key={p.username}>
                <SquareImage src={Asset.champion(p.champion)}/>
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
                <SquareImage src={Asset.champion(p.champion)}/>
              </div>
            )
          }) }
        </div>
      </div>

      <div className="row-span-2 col-start-6 font-medium text-sm text-star-dust-200 align-middle justify-self-center">
        <Link to={`/matches/${match._id}`}> View Details </Link>
      </div>

    </Card>
  )
}

export default MatchCard;

