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
import { useEffect, useRef, useState } from "react";
import { useIPCSubscription } from "@renderer/core/hooks/useIPCSubsription";
import { HighlightIPC } from "@root/shared/ipc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getHighlights } from "@renderer/api/highlight";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import { IHighlight } from "@fyp/types";
import { queryClient } from "@renderer/App";
import { useInView } from "react-intersection-observer";
import { ViewportList } from "react-viewport-list";
import Loading from "@renderer/core/Loading";
import { Outlet } from "react-router";
import InfoMessage from "@renderer/core/message/InfoMessage";

const ITEMS_PER_PAGE = 10;

const Highlights = () => {

  const [queueFilter, queueOptions] = useQueueFilter({ onClick: () => currentOffset.current = 0 });
  const [dateFilter, dateOptions] = useDateFilter({ onClick: () => currentOffset.current = 0 });
  const [championFilter, championOptions] = useChampionFilter({ onClick: () => currentOffset.current = 0 });
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { ref, inView } = useInView();
  const currentOffset = useRef(0);

  const getData = async(pageParam: number) => {
    const recordings = await getHighlights({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id, start: pageParam });
    const promises = recordings.map((hl) => window.api.file.getThumbnail(hl.fileId, "highlights"));
    const results = await Promise.all(promises);    

    return recordings.map((hl, i) => {
      return {
        highlight: hl,
        thumbnail: results[i]
      }
    })

  }

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ['highlights', queueFilter.id, dateFilter.id, championFilter.id, roleFilter],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      currentOffset.current += pageParam;
      return getData(currentOffset.current);
    },
    getNextPageParam: (prevPage) => prevPage.length === ITEMS_PER_PAGE ? prevPage.length : undefined
  })

  useIPCSubscription<{
    highlight: IHighlight,
    thumbnail: {
      id: string,
      message: 'OK',
      path: string
    }
  }>(HighlightIPC.Created, async(_, highlight) => {

    queryClient.setQueryData(['highlights', 0, 'latest', 'all', 'FILL'], (
      prev: {
        pageParams: number[],
        pages: {
          highlight: IHighlight,
          thumbnail: Awaited<ReturnType<typeof window.api.file.getThumbnail>>
        }[][]
      }) => {

      let items = prev ?? { pageParams: [0], pages: [] };

      items = {
        pageParams: items.pageParams,
        pages: [
          [
            highlight,
            ...items.pages[0]
          ],
          ...items.pages
        ]
      }
      
      return items;
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
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-3">
        <PageTitle> All Highlights </PageTitle>
        <div className="flex items-center gap-3">
          <Select value={queueFilter} options={queueOptions}/>
          <Select value={dateFilter} options={dateOptions}/>
          <SearchSelect value={championFilter} options={championOptions}/>
          <RoleSelector onChange={(r) => { setRoleFilter(r); currentOffset.current = 0; }} role={roleFilter}/>
        </div>
      </PageInnerHeader>
      
      <PageBody>
        { !isLoading ?
          <div className="flex flex-col gap-5">
            <ViewportList items={highlights} overscan={6} withCache>
              { (hl, key) => {
                return (
                  <HighlightCard data={hl} key={key} position={key + 1} playPath={`/highlights/${hl.highlight._id}`}/>
                )
              }}
            </ViewportList>
            { hasNextPage &&
              <div className="mb-0.5" ref={ref}/>
            }
          </div>
          : <Loading className="w-full my-24"/>
        }
        { isFetchingNextPage &&
          <Loading className="w-full mb-5"/>
        }
        { highlights && highlights.length === 0
          ? <InfoMessage className="bg-woodsmoke-800 rounded-lg px-5 py-10"> No results found </InfoMessage>
          : null
        }
      </PageBody>
      <Outlet/>
    </Page>
  )
}

export default Highlights;