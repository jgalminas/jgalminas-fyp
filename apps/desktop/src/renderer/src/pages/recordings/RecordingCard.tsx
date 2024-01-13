import Card from "@renderer/core/Card";
import { VideoData } from "./Recordings";
import ThumbnailPlay from "@renderer/core/video/ThumbnailPlay";
import LinkButton from "@renderer/core/LinkButton";
import RoundImage from "@renderer/core/RoundImage";
import PrettyDate from "@renderer/core/PrettyDate";
import { RoleIcons } from "@renderer/util/role";

export type RecordingCardProps = {
  video: VideoData
}

const RecordingCard = ({ video }: RecordingCardProps) => {

  return (
    <Card className="flex p-0">
      
      <ThumbnailPlay imgSrc={video.path} to='/recordings/some-id'/>

      <div className="flex flex-col py-5 justify-between">
        <div className="flex items-center gap-4">
          <RoundImage src='https://raw.communitydragon.org/latest/game/assets/characters/braum/hud/braum_circle.png'/>
          <h2 className="text-star-dust-200 font-semibold"> Game #2 </h2>
          <PrettyDate date={video.created}/>
        </div>

        <div className="flex gap-3 text-star-dust-300 items-center">
          <RoleIcons.UTILITY/>
          <p className="font-medium text-sm"> Support </p>
        </div>

        <div className="flex gap-3">
          <LinkButton to='/'> Create Highlight </LinkButton>
          <LinkButton to='/' type='text'> View Game </LinkButton>
        </div>
      </div>

    </Card>
  )
}

export default RecordingCard;