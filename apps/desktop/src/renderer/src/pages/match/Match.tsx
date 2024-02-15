import { getMatchById } from "@renderer/api/match";
import PageBody from "@renderer/core/page/PageBody";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Page from "@renderer/core/page/Page";
import { queue } from "@renderer/util/queue";
import { formatMatchLength } from "@renderer/util/time";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router";
import Tabs, { Tab } from "./Tabs";
import Divider from "@renderer/core/page/Divider";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";
import env from "@root/env";
import { getPlayer } from "@renderer/util/match";
import { useSummoner } from "@renderer/SummonerContext";
import { Asset } from "@renderer/util/asset";

const Match = () => {
  
  const { summoner } = useSummoner();

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

  const player = getPlayer(data, summoner);

  return (
    <Page header={<DefaultHeader back="/matches"/>}
    pageClass="max-w-[80rem]" contentClass="gap-0" className="z-10">
        
      <img src={Asset.splash(player.champion)}
      className="absolute w-[85%] left-1/2 -translate-x-1/2 splash-mask object-cover opacity-15 pointer-events-none"/>

      <PageInnerHeader className="gap-0 z-10">
        <PageTitle> Match Details </PageTitle>
        <div className="flex items-center gap-5 mt-1">
          <p className="text-star-dust-300 font-medium"> { queue(data.queueId) } </p>
          <p className="text-star-dust-400"> { formatMatchLength(data.start, data.finish) } </p>
        </div>
      </PageInnerHeader>

      <div className="pt-8 z-20">
        <Tabs tabs={tabs}/>
        <Divider/>
      </div>

      <PageBody className="pb-5 pt-8 z-10">
        <Outlet context={{ match: data }}/>
      </PageBody>
    </Page>
  )
}

export default Match;