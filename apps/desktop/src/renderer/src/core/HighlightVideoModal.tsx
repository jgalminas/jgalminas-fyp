import Modal from "@renderer/core/video/Modal"
import { videoUrl } from "@renderer/util/video";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router"
import X from '@assets/icons/X.svg?react';
import RoundImage from "@renderer/core/RoundImage";
import { Asset } from "@renderer/util/asset";
import { length } from '@renderer/util/time';
import { queue } from "@renderer/util/queue";
import LinkButton from "@renderer/core/LinkButton";
import { getHighlight } from "@renderer/api/highlight";
import { HighlightTag } from "./highlight/HighlightTag";

export type HighlightVideoModalProps = {
  viewGame?: boolean
}

export const HighlightVideoModal = ({ viewGame = true }: HighlightVideoModalProps) => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['highlight', id],
    queryFn: () => getHighlight(id as string)
  });

  const navigateBack = () => navigate(-1);

  if (!data) return null;

  return (
    <Modal className="h-fit flex flex-col rounded-lg drop-shadow-2xl" onClose={navigateBack}>
      <div className="flex p-1.5">
        <button className="ml-auto p-1.5 rounded-md hover:bg-woodsmoke-200" onClick={navigateBack}>
          <X className="text-star-dust-300 h-5 w-5"/>
        </button>
      </div>
      <video controls src={videoUrl(data.fileId, 'highlight')}/>
      <div className="p-3 flex gap-3 items-center">
        <RoundImage src={Asset.champion(data.champion)}/>
        <div className="flex flex-col text-sm">
          <p className="text-star-dust-300 font-medium"> { queue(data.queueId) } </p>
          <p className="text-star-dust-400"> { length(data.length) } </p>
        </div>

        <div className="flex gap-2 ml-6">
          { data.tags.map((tag, i) => (
            <HighlightTag key={i} value={tag}/>
          )) }
        </div>

        <div className="flex gap-3 ml-auto">
          { viewGame &&
            <LinkButton className="hover:bg-woodsmoke-200" to={`/matches/${data.match}`} type='text'> View Game </LinkButton>
          } 
        </div>
      </div>
    </Modal>
  )
}