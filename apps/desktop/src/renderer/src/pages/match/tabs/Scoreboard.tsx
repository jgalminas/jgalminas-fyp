import { useOutletContext } from "react-router";
import ScoreboardTable from "../components/ScoreboardTable";
import { Match } from "@fyp/types";
import { player } from "@renderer/util/match";
import { Session, useAuth } from "@renderer/auth/AuthContext";

const ScoreBoard = () => {

  const { match } = useOutletContext<{ match: Match }>();
  const { session } = useAuth();

  const user = player(match, session as Session);

  return (
    <div>
      <ScoreboardTable match={match}/>
    </div>
  )
}

export default ScoreBoard;