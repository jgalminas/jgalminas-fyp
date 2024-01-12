import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { Match } from "@fyp/types";
import { player } from "@renderer/util/match";
import { Session, useAuth } from "@renderer/auth/AuthContext";
import Card from "@renderer/core/Card";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();
  const { session } = useAuth();

  const user = player(match, session as Session);


  const Chart = () => {

    const data = [{ value: 12000 }, { value: 1000 }, { value: 300 }, { value: 9000 }]

    const findHighestValue = <T extends { value: number }>(array: T[]) => {
      if (array.length === 0) {
        return 0;
      }
    
      const largestValue = array.reduce((max, current) => {
        return current.value > max ? current.value : max;
      }, array[0].value);
    
      return largestValue;
    }

    const height = 200;
    const largest = findHighestValue(data);
    const scale = height / largest;
    const tickRate = (largest * scale) / 4;

    return (
      <Card className="w-fit m-5 flex flex-col text-sm">
        <div className="grid gap-x-2 relative place-items-center items-end pl-12 pr-4"
        style={{ height: height, gridTemplateColumns: `repeat(${data.length},minmax(0,1fr))` }}>
        { data.map((value) => {
            return (
              <div className="bg-red-500 w-6 z-10" style={{ height: `${((value.value * scale) / (largest * scale)) * 100}%` }}>
                &nbsp;
              </div>
            )
        }) }

       {
          Array.from({ length: (height / tickRate) + 1 }).map((_, i) => {
            const tick = i * tickRate / scale;
            return (
              <div className="absolute w-full items-center text-star-dust-400 gap-2 bottom-0 left-0"
              style={{ bottom: i * tickRate }}>
                <p className="absolute -translate-y-1/2">
                  { tick }
                  { tick > 1000 ? 'K' : null }
                </p>
                <div className="ml-8 bottom-1/2 bg-woodsmoke-400 h-[1px] w-[100% - 2rem]"/>
              </div>  
            )
          })
        }
        </div>

        <div className="grid gap-x-2 pl-12 pr-6 place-items-center">
        { data.map((value) => {
            return (
              <div className="row-start-2 ">
                { value.value }
              </div>
            )
          }) }
        </div>
      </Card>
    )
  }

  return (
    <div>
      <ScoreboardTable match={match}/>
      <Chart/>
    </div>
  )
}

export default ScoreBoard;