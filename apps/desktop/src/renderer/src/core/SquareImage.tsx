import { cn } from "@fyp/class-name-helper"

export type SquareImageProps = {
  src: string,
  className?: string
}

const SquareImage = ({ src, className }: SquareImageProps) => {
  return (
    <img className={cn("h-5 w-5 rounded", className)} src={src}/>
  )
}

export default SquareImage;