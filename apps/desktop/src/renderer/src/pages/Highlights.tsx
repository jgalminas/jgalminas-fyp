import PageHeader from "@renderer/core/page/PageHeader";
import Page from "../layouts/Page";
import PageTitle from "@renderer/core/page/PageTitle";
import Select from "@renderer/core/Select";
import SearchSelect from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import PageBody from "@renderer/core/page/PageBody";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { useState } from "react";
import { useIPCSubscription } from "@renderer/core/hooks/useIPCSubsription";
import { HighlightIPC } from "@root/shared/ipc";
import { useQuery } from "@tanstack/react-query";
import { getHighlights } from "@renderer/api/highlight";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import { IHighlight } from "@fyp/types";
import { queryClient } from "@renderer/App";

const Highlights = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { data } = useQuery({
    queryKey: ['highlights', queueFilter.id, dateFilter.id, championFilter.id, roleFilter],
    queryFn: () => getHighlights({ champion: championFilter.id, date: dateFilter.id, role: roleFilter, queue: queueFilter.id})
  })

  useIPCSubscription<IHighlight>(HighlightIPC.Created, (_, highlight) => {
    console.log(highlight);
    
    queryClient.setQueryData(['highlights', 0, 'latest', 'all', 'FILL'], (prev: IHighlight[]) => {
      const items = prev ?? [];
      return [
        highlight,
        ...items
      ]
    })
  }, [])

  return ( 
    <Page>
      <Page.Content className="gap-0">
        <PageHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-8">
          <PageTitle> All Highlights </PageTitle>
          <div className="flex items-center gap-3">
            <Select value={queueFilter} options={queueOptions}/>
            <Select value={dateFilter} options={dateOptions}/>
            <SearchSelect value={championFilter} options={championOptions}/>
            <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
          </div>
        </PageHeader>
        
        <PageBody>
          { data?.map((hl, i) => {
            return (
              <HighlightCard key={i} highlight={hl} position={i + 1} linkToGame/>
            )
          }) }
        </PageBody>
      </Page.Content>
    </Page>
  )
}

export default Highlights;