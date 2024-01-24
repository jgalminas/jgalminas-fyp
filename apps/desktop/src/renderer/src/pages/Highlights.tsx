import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import Page from "../core/page/Page";
import PageTitle from "@renderer/core/page/PageTitle";
import Select from "@renderer/core/Select";
import SearchSelect from "@renderer/core/SearchSelect";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import PageBody from "@renderer/core/page/PageBody";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { useEffect, useState } from "react";
import { useIPCSubscription } from "@renderer/core/hooks/useIPCSubsription";
import { HighlightIPC } from "@root/shared/ipc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getHighlights } from "@renderer/api/highlight";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import { IHighlight } from "@fyp/types";
import { queryClient } from "@renderer/App";
import { useInView } from "react-intersection-observer";
import { ViewportList } from "react-viewport-list";

const ITEMS_PER_PAGE = 10;

const Highlights = () => {

  const [queueFilter, queueOptions] = useQueueFilter();
  const [dateFilter, dateOptions] = useDateFilter();
  const [championFilter, championOptions] = useChampionFilter();
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { ref, inView } = useInView();

  const { isLoading, data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['highlights', queueFilter.id, dateFilter.id, championFilter.id, roleFilter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => getHighlights({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id, start: pageParam }),
    getNextPageParam: (prevPage) => prevPage.length === ITEMS_PER_PAGE ? prevPage.length : undefined
  })

  useIPCSubscription<IHighlight>(HighlightIPC.Created, (_, highlight) => {
    queryClient.setQueryData(['highlights', 0, 'latest', 'all', 'FILL'], (prev: IHighlight[]) => {
      const items = prev ?? [];
      return [
        highlight,
        ...items
      ]
    })
  }, [])

  useEffect(() => {
    if (inView && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [inView])

  const highlights = data?.pages.flat();

  return ( 
    <Page contentClass="gap-0">
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-8">
        <PageTitle> All Highlights </PageTitle>
        <div className="flex items-center gap-3">
          <Select value={queueFilter} options={queueOptions}/>
          <Select value={dateFilter} options={dateOptions}/>
          <SearchSelect value={championFilter} options={championOptions}/>
          <RoleSelector onChange={(r) => setRoleFilter(r)} role={roleFilter}/>
        </div>
      </PageInnerHeader>
      
      <PageBody>
        <ViewportList items={highlights} overscan={1}>
          { (hl, key) => {
            return (
              <HighlightCard highlight={hl} key={key} position={key + 1}/>
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

export default Highlights;