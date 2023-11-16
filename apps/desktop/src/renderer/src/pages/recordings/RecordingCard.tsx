import Card from "@renderer/core/Card";
import { VideoData } from "./Recordings";
import Play from '@assets/icons/Play.svg?react';

export type RecordingCardProps = {
  video: VideoData
}

const RecordingCard = ({ video }: RecordingCardProps) => {

  return (
    <Card className="p-0 h-40">
      
      <div className="relative w-fit">
        <div className="min-h-[10rem] w-full bg-gradient-to-l from-woodsmoke-700 from-[7%] to-transparent absolute right-0"/>
        <img className="h-40 rounded-l-lg" src={video.path}/>
        <Play className="absolute text-star-dust-100 w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        hover:scale-125 transition-all cursor-pointer"/>
      </div>

    </Card>
  )
}

export default RecordingCard;