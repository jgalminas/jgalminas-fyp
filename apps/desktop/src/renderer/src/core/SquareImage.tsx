import { cn } from "@fyp/class-name-helper"

export type SquareImageProps = {
  src: string,
  alt: string
  className?: string
}

const SquareImage = ({ src, alt, className }: SquareImageProps) => {
  return (
    <img alt={alt} className={cn("h-5 w-5 rounded", className)} src={src}/>
  )
}

export default SquareImage;
