import { getHighlights } from "@renderer/api/highlight";
import { getMatches } from "@renderer/api/match";
import Page from "@renderer/core/page/Page";
import PageBody from "@renderer/core/page/PageBody";
import PageInnerHeader from "@renderer/core/page/PageInnerHeader";
import PageTitle from "@renderer/core/page/PageTitle";
import { useQuery } from "@tanstack/react-query";
import { CompactMatchCard } from "./CompactMatchCard";
import { CompactHighlightCard } from "./CompactHighlightCard";
import { Outlet } from "react-router-dom";
import Loading from "@renderer/core/Loading";
import LinkButton from "@renderer/core/LinkButton";
import { useAuth } from "@renderer/auth/AuthContext";
import InfoMessage from "@renderer/core/message/InfoMessage";

const NUM_OF_HIGHLIGHTS = 5;
const NUM_OF_MATCHES = 5;

const Home = () => {

  const { session } = useAuth();

  const { data: highlights, isLoading: isHighlightsLoading } = useQuery({
    queryKey: ['recent_highlights'],
    queryFn: async() => {
      const recordings = await getHighlights({ offset: NUM_OF_HIGHLIGHTS });
      const promises = recordings.map((hl) => window.api.file.getThumbnail(hl.fileId, "highlights"));
      const results = await Promise.all(promises);

      return recordings.map((hl, i) => {
        return {
          highlight: hl,
          thumbnail: results[i]
        }
      })
    },
    refetchOnMount: true
  });

  const { data: matches, isLoading: isMatchesLoading } = useQuery({
    queryKey: ['recent_matches'],
    queryFn: () => getMatches({ offset: NUM_OF_MATCHES })
  });

  return (
    <Page contentClass="gap-0">
      <PageInnerHeader className="sticky top-0 bg-woodsmoke-900 z-50 pb-3">
        <PageTitle> Welcome, { session?.username ?? "" } </PageTitle>
      </PageInnerHeader>

      <PageBody className="pt-4">

        <h2 className="text-star-dust-200 text-lg font-medium mb-4"> Recent Highlights </h2>
        { isHighlightsLoading
          ? <Loading className="my-36"/>
          : highlights?.length !== 0
          ?
          <div className="flex flex-col mb-4 gap-2">
            <div className="flex gap-4 overflow-y-auto pb-4">
              { highlights?.map((highlight, key) => {
                  return <CompactHighlightCard key={key} data={highlight}/>
              }) }
            </div>

            <LinkButton type="text" to="/highlights" className="self-end">
              View All
            </LinkButton>
          </div>
          :
          <InfoMessage className="bg-woodsmoke-800 py-5 mb-8 rounded-lg">
            No highlights to display
          </InfoMessage>
        }

        <h2 className="text-star-dust-200 text-lg font-medium mb-4"> Recent Matches </h2>
        { isMatchesLoading
          ? <Loading className="my-36"/>
          : matches?.length !== 0 ?
          <div className="flex flex-col mb-4 gap-5">
            <div className="flex flex-col gap-4">
              { matches?.map((match, key) => {
                  return <CompactMatchCard key={key} match={match}/>
              }) }
            </div>
            <LinkButton type="text" to="/matches" className="self-end">
              View All
            </LinkButton>
          </div>
          :
          <InfoMessage className="bg-woodsmoke-800 py-5 rounded-lg">
            No matches to display
          </InfoMessage>
        }
      </PageBody>
      <Outlet/>
    </Page>
  )
}

export default Home;
