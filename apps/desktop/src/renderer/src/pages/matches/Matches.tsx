import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import { api } from "@renderer/util/api";
import { Match } from '@fyp/types';

const Matches = () => {

  const [matches, setMatches] = useState<Match[]>([]);

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
      { matches?.map((m, key) => {
        return (
          <MatchCard match={m} key={key}/>
        )
      }) }
    </Page>
  )
}

export default Matches;