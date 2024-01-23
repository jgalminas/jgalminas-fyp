import { useState } from "react";
import Page from "../../layouts/Page";
import MatchCard from "./MatchCard";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Select from "@renderer/core/Select";
import SearchSelect from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import PageBody from "@renderer/core/page/PageBody";
import { useQuery } from "@tanstack/react-query";
import { getMatches } from "@renderer/api/match";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { queryClient } from "@renderer/App";
import { Match } from "@fyp/types";
import { useSubscription } from "@renderer/core/hooks/useSubscription";

const Matches = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { data } = useQuery({
    queryKey: ['matches', queueFilter.id, dateFilter.id, championFilter.id, roleFilter],
    queryFn: () => getMatches({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id })
  })

  useSubscription((event) => {
    if (event.type === 'MATCH_UPLOADED') {
      queryClient.setQueryData(['matches', 0, 'latest', 'all', 'FILL'], (prev: Match[]) => {
        const items = prev ?? [];
        return [
          event.payload.match,
          ...items
        ]
      })
    }
  }, [])

  return ( 
    <Page>
      <Page.Content className="gap-0">
        <PageHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-8">
          <PageTitle> Played Matches </PageTitle>
          <div className="flex items-center gap-3">
            <Select value={queueFilter} options={queueOptions}/>
            <Select value={dateFilter} options={dateOptions}/>
            <SearchSelect value={championFilter} options={championOptions}/>
            <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
          </div>
        </PageHeader>
        
        <PageBody>
          { data?.map((m, key) => {
            return (
              <MatchCard match={m} key={key}/>
            )
          }) }
        </PageBody>
      </Page.Content>
    </Page>
  )
}

export default Matches;