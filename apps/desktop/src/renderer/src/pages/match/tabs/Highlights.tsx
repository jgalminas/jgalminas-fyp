import { getHighlights } from "@renderer/api/highlight";
import Loading from "@renderer/core/Loading";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import InfoMessage from "@renderer/core/message/InfoMessage";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Outlet, useParams } from "react-router";
import { ViewportList } from "react-viewport-list";

const ITEMS_PER_PAGE = 10;

const Highlights = () => {

  const { matchId } = useParams();
  const { ref, inView } = useInView();
  const currentOffset = useRef(0);

  const getData = async(pageParam: number) => {
    const recordings = await getHighlights({ match: matchId, start: pageParam });
    const promises = recordings.map((hl) => window.api.file.getThumbnail(hl.fileId, "highlights"));
    const results = await Promise.all(promises);    

    return recordings.map((hl, i) => {
      return {
        highlight: hl,
        thumbnail: results[i]
      }
    })

  }

  const queryKey = ['highlights', matchId ?? ""];

  const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      currentOffset.current += pageParam;
      return getData(currentOffset.current);
    },
    getNextPageParam: (prevPage) => prevPage?.length === ITEMS_PER_PAGE ? prevPage.length : undefined
  })

  useEffect(() => {
    if (inView && !isLoading && hasNextPage) {
      fetchNextPage();
    }
  }, [inView])

  const highlights = data?.pages.flat();

  return (
    <div className="flex flex-col gap-5">
        { !isLoading ?
          <div className="flex flex-col gap-5">
            <ViewportList items={highlights} overscan={6} withCache>
              { (hl, key) => {
                return (
                  <HighlightCard
                  key={key}
                  data={hl}
                  position={key}
                  queryKey={queryKey}
                  playPath={`/matches/${matchId}/highlights/${hl.highlight._id}`}/>
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
      <Outlet/>
    </div>
  )
}

export default Highlights;