import { IHighlight } from "@fyp/types";
import Card from "@renderer/core/Card";
import LinkButton from "@renderer/core/LinkButton";
import RoundImage from "@renderer/core/RoundImage";
import { Asset } from "@renderer/util/asset";
import { RoleIcons } from "@renderer/util/role";
import Info from '@assets/icons/Info.svg?react';
import { length } from '@renderer/util/time';
import { useNavigate } from "react-router-dom";
import Play from '@assets/icons/Play.svg?react';

export type CompactHighlightCardProps = {
  data: {
    highlight: IHighlight & { match: string },
    thumbnail: { message: 'OK', path: string } | {  message: 'VIDEO_NOT_FOUND' }
  }
}

export const CompactHighlightCard = ({ data }: CompactHighlightCardProps) => {

  const Role = data.highlight.position && RoleIcons[data.highlight.position];

  return (
    <Card data-test-id="highlight-card" className="flex flex-col p-0 min-w-fit">
      { data.thumbnail.message !== "OK"
        ? (
          <div className="aspect-video w-[19.56rem] text-star-dust-300 flex flex-col items-center justify-center gap-3">
            <Info className="w-8 h-8"/>
            <p className="max-w-[8rem] text-center text-sm text-star-dust-400"> Couldn't locate the recording </p>
          </div>
        )
        : <ThumbnailPlay imgSrc={data.thumbnail.path} to={`/home/${data.highlight._id}`}/>
      }

      <div className="flex p-5 items-center gap-5">
        <RoundImage alt={`image of ${data.highlight.champion}`} className="w-10 h-10" src={Asset.champion(data.highlight.champion)}/>
        <p className="text-star-dust-300 text-sm"> { length(data.highlight.length) } </p>
        { // @ts-expect-error
            data.highlight.position && <Role className="text-star-dust-400"/>
        }
        <LinkButton to={`/matches/${data.highlight.match}?champion=${data.highlight.champion}`} type='text'
        className="px-0 hover:bg-transparent min-w-fit ml-auto">
          View Match
        </LinkButton>
      </div>

  </Card>
  )
}

type ThumbnailPlayProps = {
  imgSrc: string,
  to: string
}

const ThumbnailPlay = ({ imgSrc, to }: ThumbnailPlayProps) => {

  const navigate = useNavigate();

  return (
    <div data-test-id="video-thumbnail" className="relative w-fit">
      <div className="min-h-full w-full bg-gradient-to-t from-woodsmoke-700 to-transparent absolute right-0"/>
      <img alt="thumbnail of highlight" className="h-44 rounded-t-lg" src={imgSrc}/>
      <button
      aria-label="Play Video"
      onClick={() => navigate(to)}
      className="absolute text-star-dust-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
      cursor-pointer">
        <Play className='w-8 h-8 hover:scale-125 transition-all'/>
      </button>
    </div>
  )
}
