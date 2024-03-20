import Play from '@assets/icons/Play.svg?react';
import { useNavigate } from 'react-router-dom';

export type ThumbnailPlayProps = {
  imgSrc: string,
  to: string
}

const ThumbnailPlay = ({ imgSrc, to }: ThumbnailPlayProps) => {

  const navigate = useNavigate();

  return (
    <div data-test-id="video-thumbnail" className="relative w-fit">
      <div className="min-h-full w-full bg-gradient-to-l from-woodsmoke-700 to-transparent absolute right-0"/>
      <img alt="thumbnail of highlight" className="h-44 rounded-l-lg" src={imgSrc}/>
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

export default ThumbnailPlay;
