import Play from '@assets/icons/Play.svg?react';
import { Link } from 'react-router-dom';

export type ThumbnailPlayProps = {
  imgSrc: string,
  to: string
}

const ThumbnailPlay = ({ imgSrc, to }: ThumbnailPlayProps) => {

  return (
    <div className="relative w-fit">
      <div className="min-h-full w-full bg-gradient-to-l from-woodsmoke-700 to-transparent absolute right-0"/>
      <img className="h-44 rounded-l-lg" src={imgSrc}/>
      <Link to={to}>
        <Play className="absolute text-star-dust-100 w-8 h-8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        hover:scale-125 transition-all cursor-pointer"/>
      </Link>
    </div>
  )
}

export default ThumbnailPlay;