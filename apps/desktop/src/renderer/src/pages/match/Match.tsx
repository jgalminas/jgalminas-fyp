import { getMatchById } from "@renderer/api/match";
import PageBody from "@renderer/core/page/PageBody";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Page from "@renderer/layouts/Page";
import { queue } from "@renderer/util/queue";
import { formatMatchLength } from "@renderer/util/time";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";
import Tabs, { Tab } from "./Tabs";
import Divider from "@renderer/core/page/Divider";

const Match = () => {
  
  const { matchId } = useParams();
  const { isLoading, isError, data } = useQuery({
    queryKey: ['match', matchId],
    queryFn: () => getMatchById(matchId as string)
  })

  const tabs: Tab[] = [
    { name: 'Scoreboard', href: `/matches/${matchId}` },
    { name: 'Timeline', href: `/matches/${matchId}/timeline` },
    { name: 'Highlights', href: `/matches/${matchId}/highlights` }
  ]

  if (isError || isLoading || !data) return null;

  return (
    <Page className="max-w-[80rem]">
      <Page.Content className="gap-0">
        <PageHeader className="sticky top-0 bg-woodsmoke-900 z-10 gap-0">
          <PageTitle> Match Details </PageTitle>
          <div className="flex items-center gap-5 mt-1">
            <p className="text-star-dust-300 font-medium"> { queue(data.queueId) } </p>
            <p className="text-star-dust-400"> { formatMatchLength(data.start, data.finish) } </p>
          </div>
          <Tabs className="mt-8" tabs={tabs}/>
          <Divider/>
        </PageHeader>
        <PageBody className="pt-8">
          <Outlet context={{ match: data }}/>
        </PageBody>
      </Page.Content>
    </Page>
  )
}

export default Match;