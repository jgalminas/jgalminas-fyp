import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import { api } from "@renderer/util/api";

const Matches = () => {

  const [matches, setMatches] = useState([]);

  useEffect(() => {

    (async() => {
      const req = await fetch(api('/v1/match/list'), {
        credentials: "include"
      });

      setMatches(await req.json());
    })();
    
  }, [])

  return ( 
    <Page>
      Matches
      { matches.map((m) => {
        return (
          <MatchCard/>
        )
      }) }
    </Page>
  )
}

export default Matches;