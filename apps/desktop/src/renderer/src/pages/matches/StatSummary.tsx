import { cn } from "@fyp/class-name-helper"
import { getSummary } from "@renderer/api/stats";
import Card from "@renderer/core/Card"
import KDA from "@renderer/core/match/KDA";
import Stat from "@renderer/core/match/Stat";
import Divider from "@renderer/core/page/Divider";
import { useQuery } from "@tanstack/react-query";
import { Cell, PieChart, Pie } from "recharts";

export type StatSummaryProps = {
  className?: string
}

export const StatSummary = ({ className }: StatSummaryProps) => {

  const { data: summary, isLoading: isSummaryLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary
  });

  if (!summary || isSummaryLoading) return;

  const winRate = summary.totalWins / summary.totalMatches;

  const pieData = [
    { value: winRate },
    { value: 1 - (winRate) }
  ]

  return (
    <Card className={cn("h-fit p-0", className)}>
      <p className="px-5 pt-5 mb-4 text-star-dust-300 uppercase font-medium text-xs">
        STATS SUMMARY
      </p>

      <Divider className="mx-5"/>
      
      <div className="flex items-center p-3 pr-5">
        <PieChart className="mr-2" width={68} height={68} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            dataKey="value"
            innerRadius={18}
            startAngle={90}
            endAngle={450}
            fill="#fff"
            data={pieData}
            stroke="transparent">
            { pieData.map((_, key) => {
              return (
                <Cell key={key} fill={key === 0 ? "#0068CA" : "#25292F"}/>
              )
            }) }
          </Pie>
        </PieChart>
        
        <div className="mr-5">
          <Stat  value={(winRate * 100).toFixed(2) + '%'} type="WR"/>
          <p className="text-sm text-star-dust-400"> { summary.totalMatches } Games </p>
        </div>

        <div>
          <Stat value={summary.kda.toFixed(2)} type="KDA"/>
          <KDA className="text-star-dust-400" stats={{
            kills: summary.avgKills.toFixed(2),
            deaths: summary.avgDeaths.toFixed(2),
            assists: summary.avgAssists.toFixed(2)
          }}/>
        </div>

      </div>
    </Card>
  )
}
