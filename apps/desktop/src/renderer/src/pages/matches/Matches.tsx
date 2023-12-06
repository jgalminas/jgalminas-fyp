import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import { api } from "@renderer/util/api";
import { IMatch } from '@fyp/types';
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Divider from "@renderer/core/page/Divider";

const Matches = () => {

  const [matches, setMatches] = useState<IMatch[]>([]);

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
      <PageHeader>
        <PageTitle> Game Recordings </PageTitle>
        <Divider/>
      </PageHeader>
      { matches?.map((m, key) => {
        return (
          <MatchCard match={m} key={key}/>
        )
      }) }
    </Page>
  )
}

export default Matches;