import { cn } from "@fyp/class-name-helper";

export type RoundImageProps = {
  className?: string,
  src: string
}

const RoundImage = ({ className, src }: RoundImageProps) => {

  return (
    <img src={src} className={cn("w-9 h-9 rounded-full border-2 border-woodsmoke-500", className)}/>
  )
}

export default RoundImage;