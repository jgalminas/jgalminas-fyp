import { getHighlights } from "@renderer/api/highlight";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const Highlights = () => {

  const { matchId } = useParams();

  const { data } = useQuery({
    queryKey: ['highlights', matchId],
    queryFn: () => getHighlights({ match: matchId })
  })

  return (
    <div className="flex flex-col gap-5">
      { data?.map((hl, i) => {
        return (
          <HighlightCard key={i} highlight={hl} position={i + 1}/>
        )
      }) }
    </div>
  )
}

export default Highlights;