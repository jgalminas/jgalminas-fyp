import { getMatchById } from "@renderer/api/match";
import Divider from "@renderer/core/page/Divider";
import PageContent from "@renderer/core/page/PageContent";
import PageHeader from "@renderer/core/page/PageHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Page from "@renderer/layouts/Page";
import { queue } from "@renderer/util/queue";
import { formatMatchLength } from "@renderer/util/time";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";
import Tabs, { Tab } from "./Tabs";

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
    <Page>
      <PageHeader className="gap-0">
        <PageTitle> Match Details </PageTitle>
        <div className="flex items-center gap-5 mt-1">
          <p className="text-star-dust-300 font-medium"> { queue(data.queueId) } </p>
          <p className="text-star-dust-400"> { formatMatchLength(data.start, data.finish) } </p>
        </div>
        <Tabs className="mt-8" tabs={tabs}/>
        <Divider/>
      </PageHeader>
      <PageContent>
        <Outlet context={{ match: data }}/>
      </PageContent>
    </Page>
  )
}

export default Match;