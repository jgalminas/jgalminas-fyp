import { cn } from "@fyp/class-name-helper";

export type LoadingProps = {
  className?: string
}

const Loading = ({ className }: LoadingProps) => {

  return (
    <div aria-label="Loading Indicator" className="flex justify-center">
      <div className={cn("dot-pulse text-star-dust-200", className)}/>
    </div>
  )
}

export default Loading;