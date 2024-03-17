import { Asset } from "@renderer/util/asset";
import { createPortal } from "react-dom";

export type BackgroundImageProps = {
  champion: string
}

export const BackgroundImage = ({ champion }: BackgroundImageProps) => {

  return createPortal(
    <div className="select-none w-full h-full absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden flex items-center justify-center">
      <img src={Asset.splash(champion)}
      className=" scale-125 splash-mask object-cover opacity-15 pointer-events-none"/>
    </div>,
    document.getElementById("page")!!
  )
}
