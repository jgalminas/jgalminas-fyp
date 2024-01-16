import { useState } from "react";
import Page from "../../layouts/Page";
import RecordingCard from "./RecordingCard";
import PageTitle from "@renderer/core/page/PageTitle";
import PageHeader from "@renderer/core/page/PageHeader";
import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRecordings } from "@renderer/api/recording";
import Select from "@renderer/core/Select";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import SearchSelect from "@renderer/core/SearchSelect";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import PageBody from "@renderer/core/page/PageBody";

export type VideoData = {
  name: string,
  path: string,
  size: number, 
  created: Date
  length?: number
}

const Recordings = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { isLoading, data } = useQuery({
    queryKey: ['recordings', queueFilter, dateFilter, championFilter, roleFilter],
    queryFn: () => getRecordings({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id }),
  });

  if (isLoading) return null;

  return ( 
    <Page>
      <Page.Content className="gap-0">
        <PageHeader className="sticky top-0 bg-woodsmoke-900 z-10 pb-8">
          <PageTitle> Game Recordings </PageTitle>
          <div className="flex items-center gap-3">
            <Select value={queueFilter} options={queueOptions}/>
            <Select value={dateFilter} options={dateOptions}/>
            <SearchSelect value={championFilter} options={championOptions}/>
            <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
          </div>
        </PageHeader>
        <PageBody>
          { data?.map((rec, key) => (
            <RecordingCard recording={rec} position={key + 1} key={key}/>
          )) }
        </PageBody>
        <Outlet/>
      </Page.Content>
    </Page>
  )
}

export default Recordings;