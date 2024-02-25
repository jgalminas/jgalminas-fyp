import { getChampionStats } from "@renderer/api/stats";
import Card from "@renderer/core/Card"
import Loading from "@renderer/core/Loading";
import SquareImage from "@renderer/core/SquareImage";
import Stat from "@renderer/core/match/Stat";
import Divider from "@renderer/core/page/Divider";
import { Asset } from "@renderer/util/asset";
import { round } from "@renderer/util/number";
import { getChampionNameById } from "@root/constants";
import { useQuery } from "@tanstack/react-query";


export const ChampionStats = () => {

  const { data, isLoading } = useQuery({
    queryKey: ['champion-stats'],
    queryFn: getChampionStats
  });

  return (
    <Card>
      <p className="mb-4 text-star-dust-300 uppercase font-medium text-xs">
        MOST PLAYED CHAMPIONS
      </p>

      <Divider/>

      { !isLoading ?
        <ul className="flex flex-col gap-3 mt-4">
          { data?.map((it, key) => {
            return (
              <li key={key} className="flex items-center gap-3">
                <div className="w-12 h-12 overflow-hidden border-2 border-woodsmoke-100 rounded-md">
                  <SquareImage className="scale-[115%] w-full h-full" src={Asset.champion(it.champion)}/>
                </div>

                <div>
                  <p className="text-star-dust-200 font-medium text-sm"> { getChampionNameById(it.champion) } </p>
                  <p className="text-sm text-star-dust-400"> { it.totalMatches } {`Game${ it.totalMatches > 1 ? 's' : '' }`} </p>
                </div>

                <div className="ml-auto">
                  <Stat value={round(it.kda)} type="KDA"/>
                  <Stat  value={round(it.winRate * 100) + '%'} type="WR"/>
                </div>
              </li>
            )
          }) }
        </ul>
        : <Loading className="mt-11 mb-8"/>
      }

    </Card>
  )
}