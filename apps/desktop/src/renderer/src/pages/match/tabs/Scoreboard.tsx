import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { IParticipant, Match } from "@fyp/types";
import { BarChart } from "../components/BarChart";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();

  const damage = match.participantStats.map((value) => {
    const participant = match.participants.find((p) => p.participantId === value.participantId) as IParticipant;
    return {
      value: value.physicalDamageToChampions + value.magicDamageToChampions + value.trueDamageToChampions,
      label: participant.champion,
      color: participant.team === 'BLUE' ? '#0068CA' : '#FF3B3A'
    }
  }).sort((a, b) => a.value > b.value ? -1 : 1);

  const income = match.participantStats.map((value) => {
    const participant = match.participants.find((p) => p.participantId === value.participantId) as IParticipant;
    return {
      value: value.totalGold,
      label: participant.champion,
      color: participant.team === 'BLUE' ? '#0068CA' : '#FF3B3A'
    }
  }).sort((a, b) => a.value > b.value ? -1 : 1);

  return (
    <div className="grid grid-cols-2 gap-6 grid-rows-[auto,auto]">
      <ScoreboardTable className="col-span-full" match={match}/>
      <BarChart height={280} data={damage} label="Damage Distribution"/>
      <BarChart height={280} data={income} label="Income"/>
    </div>
  )
}

export default ScoreBoard;