import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { IParticipant, Match } from "@fyp/types";
// import BarChart from "../components/BarChart";
import RoundImage from "@renderer/core/RoundImage";
import { Asset } from "@renderer/util/asset";
import { cn } from "@fyp/class-name-helper";
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

  const data = [
    {
      label: "Akshan",
      value: 2002,
      color: 'red'
    },
    {
      label: "Fizz",
      value: 20022,
      color: 'red'
    }
  ]



  return (
    <div className="grid grid-cols-2 gap-6 grid-rows-[auto,auto]">
      <ScoreboardTable className="col-span-full" match={match}/>
      <BarChart height={280} data={damage} label="Damage Distribution"/>
      <BarChart height={280} data={income} label="Income"/>

      {/* <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ bottom: 32, top: 16 }} maxBarSize={16}>
          <CartesianGrid vertical={false} stroke="black"/>
          <XAxis dataKey="name" tickLine={false} tick={CustomTick} interval={0} axisLine={false}/>
          <YAxis interval={0} tickLine={false} axisLine={false} tick={{ fill: '#000' }}/>
          <Tooltip contentStyle={{ backgroundColor: "#fff", borderRadius: 8 }}/>
          <Bar dataKey="pv" fill="#8884d8">
          { data.map((entry, index) => (
            <Cell key={index} fill={entry.name === "Akshan" ? '#290a0a' : '#005599' }/>
          ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer> */}

      {/* <BarChart className="h-fit" height={200} data={damage} label="Damage Distribution"/>
      <BarChart className="h-fit" height={200} data={income} label="Income"/> */}
    </div>
  )
}

export default ScoreBoard;