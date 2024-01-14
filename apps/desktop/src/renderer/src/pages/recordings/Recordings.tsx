import { useState } from "react";
import Page from "../../layouts/Page";
import RecordingCard from "./RecordingCard";
import PageTitle from "@renderer/core/page/PageTitle";
import PageHeader from "@renderer/core/page/PageHeader";
import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRecordings } from "@renderer/api/recording";
import Select, { SelectOption } from "@renderer/core/Select";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import { QUEUE } from "@fyp/types";
import { queue } from "@renderer/util/queue";

export type VideoData = {
  name: string,
  path: string,
  size: number, 
  created: Date
  length?: number
}

const Recordings = () => {

  const dateOptions: SelectOption[] = [
    {
      id: -1,
      value: 'Latest',
      onClick: (opt) => setDateFilter(opt)
    },
    {
      id: 1,
      value: 'Oldest',
      onClick: (opt) => setDateFilter(opt)
    }
  ]

  const queueOptions: SelectOption[] = [
    {
      id: 'all',
      value: 'All game modes',
      onClick: (opt) => setQueueFilter(opt)
    },
    ...QUEUE.map(q => ({
      id: q,
      value: queue(q),
      onClick: (opt) => setQueueFilter(opt)
    }))
  ]

  const [queueFilter, setQueueFilter] = useState<SelectOption>(queueOptions[0]);
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');
  const [dateFilter, setDateFilter] = useState<SelectOption>(dateOptions[0]);

  const { isLoading, isError, data } = useQuery({
    queryKey: ['recordings'],
    queryFn: getRecordings
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
            {/* <SearchSelect placeholder="Filter by champion" value={champ} options={opts}/> */}
            <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
          </div>
        </PageHeader>
        <div className="flex flex-col gap-6">
          { data?.map((rec, key) => (
            <RecordingCard recording={rec} position={key + 1} key={key}/>
          )) }
        </div>
        <Outlet/>
      </Page.Content>
    </Page>
  )
}

export default Recordings;