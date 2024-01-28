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
import Loading from "@renderer/core/Loading";
import InfoMessage from "@renderer/core/message/InfoMessage";

const ITEMS_PER_PAGE = 10;

const Matches = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { ref, inView } = useInView();

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
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

  const matches = data?.pages.flat();

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
        { !isLoading ?
          <div className="flex flex-col gap-5">
            <ViewportList items={matches} overscan={6} withCache>
              { (match, key) => {
                return (
                  <MatchCard match={match} key={key}/>
                )
              }}
            </ViewportList>
            { hasNextPage &&
              <div ref={ref}/>
            }
          </div>
          : <Loading className="w-full my-24"/>
        }
        { isFetchingNextPage &&
          <Loading className="w-full mb-5"/>
        }
        { matches && matches.length === 0
          ? <InfoMessage className="bg-woodsmoke-800 rounded-lg px-5 py-10"> No results found </InfoMessage>
          : null
        }
      </PageBody>
    </Page>
  )
}

export default Matches;