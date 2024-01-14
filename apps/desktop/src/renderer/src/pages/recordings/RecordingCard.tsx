import Card from "@renderer/core/Card";
import ThumbnailPlay from "@renderer/core/video/ThumbnailPlay";
import LinkButton from "@renderer/core/LinkButton";
import RoundImage from "@renderer/core/RoundImage";
import PrettyDate from "@renderer/core/PrettyDate";
import { RoleIcons } from "@renderer/util/role";
import { IRecording } from "@fyp/types";
import { useEffect, useState } from "react";
import { Asset } from "@renderer/util/asset";

export type RecordingCardProps = {
  recording: IRecording & { match: string },
  position: number
}

const RecordingCard = ({ recording, position }: RecordingCardProps) => {

  const [path, setPath] = useState<string | null>(null);

  useEffect(() => {
    (async() => {
      const fp = await window.api.file.getThumbnail(recording.gameId);
      setPath(fp);
    })();
  }, [])

  if (!path) return null;

  return (
    <Card className="flex p-0">
      
      <ThumbnailPlay imgSrc={path} to='/recordings/some-id'/>

      <div className="flex flex-col py-5 justify-between">
        <div className="flex items-center gap-4">
          <RoundImage src={Asset.champion(recording.champion)}/>
          <h2 className="text-star-dust-200 font-semibold"> Game #{ position } </h2>
          <PrettyDate date={new Date(recording.createdAt)}/>
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