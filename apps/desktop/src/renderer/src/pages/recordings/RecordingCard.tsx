import Card from "@renderer/core/Card";
import { VideoData } from "./Recordings";

export type RecordingCardProps = {
  video: VideoData
}

const RecordingCard = ({ video }: RecordingCardProps) => {

  console.log(video.path);
  

  return (
    <Card>
      <img className="h-16 w-16" src={video.path}/>
      { video.name }
    </Card>
  )
}

export default RecordingCard;