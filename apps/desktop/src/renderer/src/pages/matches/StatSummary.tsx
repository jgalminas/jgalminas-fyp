import { cn } from "@fyp/class-name-helper"
import { getSummary } from "@renderer/api/stats";
import Card from "@renderer/core/Card"
import Loading from "@renderer/core/Loading";
import KDA from "@renderer/core/match/KDA";
import Stat from "@renderer/core/match/Stat";
import Divider from "@renderer/core/page/Divider";
import { round } from "@renderer/util/number";
import { useQuery } from "@tanstack/react-query";
import { Cell, PieChart, Pie } from "recharts";

export type StatSummaryProps = {
  className?: string
}

export const StatSummary = ({ className }: StatSummaryProps) => {

  const { data: summary, isLoading } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary
  });

  const winRate = (summary ? summary.totalWins : 1) / (summary ? summary.totalMatches : 1);

  const pieData = [
    { value: winRate },
    { value: 1 - (winRate) }
  ]

  return (
    <Card className={cn("h-fit p-0", className)}>
      <p className="px-5 pt-5 mb-4 text-star-dust-300 uppercase font-medium text-xs">
        STATS SUMMARY
      </p>

      <Divider className="mx-5 pb-5"/>

      { !isLoading ?
          summary ?
            <div className="flex items-center pt-0 p-3 pr-5">
              <PieChart className="mr-2" width={68} height={68} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  className="focus:outline-none"
                  isAnimationActive={false}
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
                <Stat  value={round(winRate * 100) + '%'} type="WR"/>
                <p className="text-sm text-star-dust-400"> { summary.totalMatches } Games </p>
              </div>

              <div>
                <Stat value={round(summary.kda)} type="KDA"/>
                <KDA className="text-star-dust-400" stats={{
                  kills: round(summary.avgKills),
                  deaths: round(summary.avgDeaths),
                  assists: round(summary.avgAssists)
                }}/>
              </div>

            </div>
          : null
        : <Loading className="mt-7 mb-11"/>
      }

    </Card>
  )
}
