import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import { api } from "@renderer/util/api";
import { IMatch } from '@fyp/types';
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Divider from "@renderer/core/page/Divider";
import Select from "@renderer/core/Select";
import SearchSelect from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";

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

  const [role, setRole] = useState<Role>('FILL');

  return ( 
    <Page>
      <PageHeader>
        <PageTitle> Game Recordings </PageTitle>
        <Divider/>
        <div className="flex items-center gap-3">
        <Select placeholder="All game modes" options={[{ id: '2', value: 'Ranked', onClick: () => {} }]}/>
        <SearchSelect placeholder="Search by champion" options={[{ id: '2', value: 'Ranked', onClick: () => { } }]}/>
        <RoleSelector onChange={(r) => setRole(r)} role={role}/>
        </div>

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