import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { Match } from "@fyp/types";
import { player } from "@renderer/util/match";
import { Session, useAuth } from "@renderer/auth/AuthContext";
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { cn } from "@fyp/class-name-helper";
import { Fragment } from "react";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();
  const { session } = useAuth();

  const user = player(match, session as Session);


  const Chart = () => {

    const data = [{ value: 20 }, { value: 30 }, { value: 15 }]

    const height = 30; // find largest from the data
    const scale = 5;

    return (
        <div className={cn("grid grid-rows-[1fr,auto] gap-x-2 relative place-items-center items-end w-fit")}
        style={{ height: height * scale, gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
          <div className="col-span-full grid gap-x-2 items-end h-full relative"
          style={{ gridTemplateColumns: 'repeat(3,minmax(0,1fr))' }}>
            { data.map((value) => {
              return (
                <Fragment>
                  <div className="min-h-[1px] absolute w-full z-50 left-0 bottom-1/2 bg-green-500"/>
                  <div className="bg-red-500 w-6 relative" style={{ height: `${((value.value * scale) / (height * scale)) * 100}%` }}>
                    &nbsp;
                  </div>
                </Fragment>
              )
            }) }
          </div>
          { data.map((value) => {
            return (
              <div className="row-start-2">
                { value.value }
              </div>
            )
          }) }
        </div>
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