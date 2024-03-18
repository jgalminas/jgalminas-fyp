import RoundImage from "@renderer/core/RoundImage";
import Ban from '@assets/icons/Ban.svg?react';
import { Asset } from "@renderer/util/asset";

export type BannedChampionProps = {
  champion: string
}

const BannedChampion = ({ champion }: BannedChampionProps) => {
  return (
    <div className="relative">
        <RoundImage alt={`image of a banned champion: ${champion}`} className="border-[3px] border-gray-900 w-10 h-10 saturate-0" src={Asset.champion(champion)}/>
        <Ban className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full scale-95"/>
    </div>
  )
}

export default BannedChampion;
