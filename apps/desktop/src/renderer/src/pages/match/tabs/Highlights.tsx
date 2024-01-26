import { getHighlights } from "@renderer/api/highlight";
import HighlightCard from "@renderer/core/highlight/HighlightCard";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

const Highlights = () => {

  const { matchId } = useParams();

  const getData = async() => {
    const recordings = await getHighlights();
    const promises = recordings.map((hl) => window.api.file.getThumbnail(hl.fileId, "highlights"));
    const results = await Promise.all(promises);    

    return recordings.map((hl, i) => {
      return {
        highlight: hl,
        thumbnail: results[i]
      }
    })

  }

  const { data } = useQuery({
    queryKey: ['highlights', matchId],
    queryFn: getData
  })

  return (
    <div className="flex flex-col gap-5">
      { data?.map((hl, i) => {
        return (
          <HighlightCard key={i} data={hl} position={i + 1}/>
        )
      }) }
    </div>
  )
}

export default Highlights;