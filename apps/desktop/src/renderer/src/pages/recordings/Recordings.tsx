import { useEffect, useState } from "react";
import Page from "../../layouts/Page";
import RecordingCard from "./RecordingCard";
import PageTitle from "@renderer/core/page/PageTitle";
import PageHeader from "@renderer/core/page/PageHeader";
import Divider from "@renderer/core/page/Divider";
import { Outlet } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { getRecordings } from "@renderer/api/recording";

export type VideoData = {
  name: string,
  path: string,
  size: number, 
  created: Date
  length?: number
}

const Recordings = () => {

  const { isLoading, isError, data } = useQuery({
    queryKey: ['recordings'],
    queryFn: getRecordings
  });
  
  if (isLoading) return null;

  return ( 
    <Page className="relative">
      <Page.Content>
        <PageHeader>
          <PageTitle> Game Recordings </PageTitle>
          <Divider/>
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