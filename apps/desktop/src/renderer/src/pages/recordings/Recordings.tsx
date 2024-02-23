import { useEffect, useRef, useState } from "react";
import Page from "../../core/page/Page";
import RecordingCard from "./RecordingCard";
import PageTitle from "@renderer/core/page/PageTitle";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import { Outlet } from "react-router";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getRecordings } from "@renderer/api/recording";
import Select from "@renderer/core/Select";
import RoleSelector, { Role } from "@renderer/core/RoleSelector";
import SearchSelect from "@renderer/core/SearchSelect";
import { useQueueFilter } from "@renderer/core/hooks/filter/useQueueFilter";
import { useChampionFilter } from "@renderer/core/hooks/filter/useChampionFilter";
import { useDateFilter } from "@renderer/core/hooks/filter/useDateFilter";
import PageBody from "@renderer/core/page/PageBody";
import InfoMessage from "@renderer/core/message/InfoMessage";
import { IRecording } from "@fyp/types";
import { RecordingIPC } from "@root/shared/ipc";
import { useIPCSubscription } from "@renderer/core/hooks/useIPCSubsription";
import { queryClient } from "@renderer/App";
import { ViewportList } from "react-viewport-list";
import { useInView } from "react-intersection-observer";
import Loading from "@renderer/core/Loading";

export type VideoData = {
  name: string,
  path: string,
  size: number, 
  created: Date
  length?: number
}

const ITEMS_PER_PAGE = 10;

const Recordings = () => {

  const [queueFilter, queueOptions] = useQueueFilter({ onClick: () => currentOffset.current = 0 });
  const [dateFilter, dateOptions] = useDateFilter({ onClick: () => currentOffset.current = 0 });
  const [championFilter, championOptions] = useChampionFilter({ onClick: () => currentOffset.current = 0 });
  const [roleFilter, setRoleFilter] = useState<Role>('FILL');

  const { ref, inView } = useInView();
  const currentOffset = useRef(0);

  const getData = async(pageParam: number) => {
    const recordings = await getRecordings({ champion: championFilter.id, role: roleFilter, date: dateFilter.id, queue: queueFilter.id, start: pageParam });
    const promises = recordings.map((rec) => window.api.file.getThumbnail(rec.gameId, "recordings"));
    const results = await Promise.all(promises);    

    return recordings.map((rec, i) => {
      return {
        recording: rec,
        thumbnail: results[i]
      }
    })

  }

  const queryKey = ['recordings', queueFilter.id, dateFilter.id, championFilter.id, roleFilter];

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      currentOffset.current += pageParam;
      return getData(currentOffset.current);
    },
    getNextPageParam: (prevPage) => prevPage.length === ITEMS_PER_PAGE ? prevPage.length : undefined
  })

  useIPCSubscription<IRecording>(RecordingIPC.Created, async(_, recording) => {
    const thumbnail = await window.api.file.getThumbnail(recording._id.toString(), "recordings");

    queryClient.setQueryData(['recordings', 0, 'latest', 'all', 'FILL'], (
      prev: {
        pageParams: number[],
        pages: {
          recording: IRecording,
          thumbnail: Awaited<ReturnType<typeof window.api.file.getThumbnail>>
        }[][]
      }) => {

        let items = prev ?? { pageParams: [0], pages: [] };
        items = {
          pageParams: items.pageParams,
          pages: [
            [
              {
                recording: recording,
                thumbnail: thumbnail
              },
              ...items.pages[0]
            ],
            ...items.pages.slice(1)
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

  const recordings = data?.pages.flat();

  return ( 
    <Page  contentClass="gap-0">
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-10 pb-3">
        <PageTitle> Game Recordings </PageTitle>
        <div className="flex items-center gap-3">
          <Select value={queueFilter} options={queueOptions}/>
          <Select value={dateFilter} options={dateOptions}/>
          <SearchSelect value={championFilter} options={championOptions} withIcons/>
          <RoleSelector onChange={(r) => { setRoleFilter(r); currentOffset.current = 0; }} role={roleFilter}/>
        </div>
      </PageInnerHeader>
      <PageBody>
        { !isLoading ?
          <div className="flex flex-col gap-5">
            <ViewportList items={recordings} overscan={6} withCache>
              { (rec, key) => {
                return (
                  <RecordingCard queryKey={queryKey} data={rec} key={key} position={key + 1}/>
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
        { recordings && recordings.length === 0
          ? <InfoMessage className="bg-woodsmoke-800 rounded-lg px-5 py-10"> No results found </InfoMessage>
          : null
        }
      </PageBody>
      <Outlet/>
    </Page>
  )
}

export default Recordings;