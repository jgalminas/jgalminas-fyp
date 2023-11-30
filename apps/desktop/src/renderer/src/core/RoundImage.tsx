import { cn } from "@fyp/class-name-helper";

export type RoundImageProps = {
  className?: string,
  src: string
}

const RoundImage = ({ className, src }: RoundImageProps) => {

  return (
    <div className={cn("w-9 h-9 rounded-full overflow-hidden border-2 border-woodsmoke-100", className)}>
      <img src={src} className={"scale-[115%]"}/>
    </div>
  )
}

export default RoundImage;