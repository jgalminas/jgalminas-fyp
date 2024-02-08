import { getRecording } from "@renderer/api/recording";
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

const RecordingVideoModal = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ['recording', id],
    queryFn: () => getRecording(id as string)
  });

  const navigateBack = () => navigate('/recordings');

  if (!data) return null;

  return (
    <Modal className="h-fit flex flex-col rounded-lg drop-shadow-2xl" onClose={navigateBack}>
      <div className="flex p-1.5">
        <button className="ml-auto p-1.5 rounded-md hover:bg-woodsmoke-200" onClick={navigateBack}>
          <X className="text-star-dust-300 h-5 w-5"/>
        </button>
      </div>
      <video controls src={videoUrl(data.gameId, 'recording')}/>
      <div className="p-3 flex gap-3 items-center">
        <RoundImage src={Asset.champion(data.champion)}/>
        <div className="flex flex-col text-sm">
          <p className="text-star-dust-300 font-medium"> { queue(data.queueId) } </p>
          <p className="text-star-dust-400"> { length(data.length) } </p>
        </div>
        <div className="flex gap-3 ml-auto">
          <LinkButton to='/'> Create Highlight </LinkButton>
          <LinkButton className="hover:bg-woodsmoke-200" to={`/matches/${data.match}`} type='text'> View Game </LinkButton>
        </div>
      </div>
    </Modal>
  )
}

export default RecordingVideoModal;