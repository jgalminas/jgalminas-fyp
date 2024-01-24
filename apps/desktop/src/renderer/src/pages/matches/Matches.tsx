import { useEffect, useState } from "react";
import Page from "../../core/page/Page";
import MatchCard from "./MatchCard";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import Select from "@renderer/core/Select";
import SearchSelect from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import PageBody from "@renderer/core/page/PageBody";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getMatches } from "@renderer/api/match";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { queryClient } from "@renderer/App";
import { Match } from "@fyp/types";
import { useSubscription } from "@renderer/core/hooks/useSubscription";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";
import { useInView } from 'react-intersection-observer';
import { ViewportList } from 'react-viewport-list';

const ITEMS_PER_PAGE = 10;

const Matches = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { ref, inView } = useInView();

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['matches', queueFilter.id, dateFilter.id, championFilter.id, roleFilter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getMatches({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id, start: pageParam }),
    getNextPageParam: (prevPage) => prevPage.length === ITEMS_PER_PAGE ? prevPage.length : undefined
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

  useEffect(() => {
    if (inView && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [inView])

  return ( 
    <Page header={<DefaultHeader/>} contentClass="gap-0">
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-3">
        <PageTitle> Played Matches </PageTitle>
        <div className="flex items-center gap-3">
          <Select value={queueFilter} options={queueOptions}/>
          <Select value={dateFilter} options={dateOptions}/>
          <SearchSelect value={championFilter} options={championOptions}/>
          <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
        </div>
      </PageInnerHeader>
      <PageBody>
        <ViewportList items={data?.pages.flat()} overscan={1}>
          { (match, key) => {
            return (
              <MatchCard match={match} key={key}/>
            )
          }}
        </ViewportList>
        { hasNextPage &&
          <div ref={ref}/>
        }
      </PageBody>
    </Page>
  )
}

export default Matches;