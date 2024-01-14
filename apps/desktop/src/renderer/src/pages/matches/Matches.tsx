import { useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Divider from "@renderer/core/page/Divider";
import Select from "@renderer/core/Select";
import SearchSelect, { SearchSelectOption } from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import PageContent from "@renderer/core/page/PageContent";
import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@renderer/api/match";

const Matches = () => {

  const { isLoading, isError, data } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches
  })

  if (isError) return null;

  const [role, setRole] = useState<Role>('FILL');

  return ( 
    <Page>
      <Page.Content className="gap-0">
        <PageHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-8">
          <PageTitle> Played Matches </PageTitle>
          <div className="flex items-center gap-3">
          <Select placeholder="All game modes" options={[{ id: '2', value: 'Ranked', onClick: () => {} }]}/>
          {/* <SearchSelect placeholder="Filter by champion" value={champ} options={opts}/> */}
          <RoleSelector onChange={(r) => setRole(r)} role={role}/>
          </div>
        </PageHeader>
        
        <PageContent>
          { data?.map((m, key) => {
            return (
              <MatchCard match={m} key={key}/>
            )
          }) }
        </PageContent>
      </Page.Content>
    </Page>
  )
}

export default Matches;