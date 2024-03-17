import { cn } from "@fyp/class-name-helper";

export type RoundImageProps = {
  className?: string,
  src: string
  alt: string
}

const RoundImage = ({ className, src, alt }: RoundImageProps) => {

  return (
    <div className={cn("w-9 h-9 rounded-full overflow-hidden border-2 border-woodsmoke-100", className)}>
      <img alt={alt} src={src} className={"scale-[115%] w-full h-full"}/>
    </div>
  )
}

export default RoundImage;
