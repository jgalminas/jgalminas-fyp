import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { IParticipant, Match } from "@fyp/types";
import BarChart from "../components/BarChart";
import RoundImage from "@renderer/core/RoundImage";
import { Asset } from "@renderer/util/asset";
import { cn } from "@fyp/class-name-helper";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();

  const damage = match.participantStats.map((value) => {
    const participant = match.participants.find((p) => p.participantId === value.participantId) as IParticipant;
    return {
      value: value.physicalDamageToChampions + value.magicDamageToChampions + value.trueDamageToChampions,
      label: (
        <RoundImage src={Asset.champion(participant.champion)}
        className={cn("mt-4 h-10 w-10", participant.team === 'BLUE' ? "border-accent-blue" : "border-accent-red")}/>
      ),
      color: participant.team === 'BLUE' ? 'bg-accent-blue' : 'bg-accent-red'
    }
  }).sort((a, b) => a.value > b.value ? -1 : 1);

  const income = match.participantStats.map((value) => {
    const participant = match.participants.find((p) => p.participantId === value.participantId) as IParticipant;
    return {
      value: value.totalGold,
      label: (
        <RoundImage src={Asset.champion(participant.champion)}
        className={cn("mt-4 h-10 w-10", participant.team === 'BLUE' ? "border-accent-blue" : "border-accent-red")}/>
      ),
      color: participant.team === 'BLUE' ? 'bg-accent-blue' : 'bg-accent-red'
    }
  }).sort((a, b) => a.value > b.value ? -1 : 1);

  return (
    <div className="grid grid-cols-2 gap-6 grid-rows-[auto,auto]">
      <ScoreboardTable className="col-span-full" match={match}/>
      <BarChart className="h-fit" height={200} data={damage} label="Damage Distribution"/>
      <BarChart className="h-fit" height={200} data={income} label="Income"/>
    </div>
  )
}

export default ScoreBoard;