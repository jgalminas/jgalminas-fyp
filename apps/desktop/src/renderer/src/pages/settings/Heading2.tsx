import { cn } from "@fyp/class-name-helper"

export type Heading2Props = {
  children?: string,
  className?: string
}

export const Heading2 = ({ children, className }: Heading2Props) => {

  return (
    <h2 className={cn("font-medium text-lg text-star-dust-200 leading-10", className)}>
      { children }
    </h2>
  )
}
