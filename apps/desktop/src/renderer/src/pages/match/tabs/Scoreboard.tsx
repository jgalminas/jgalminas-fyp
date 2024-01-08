import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { Match } from "@fyp/types";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();

  return (
    <div>
      <ScoreboardTable match={match}/>
    </div>
  )
}

export default ScoreBoard;