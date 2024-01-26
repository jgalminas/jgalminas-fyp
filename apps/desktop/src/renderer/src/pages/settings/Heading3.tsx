import { cn } from "@fyp/class-name-helper"

export type Heading3Props = {
  children?: string,
  className?: string
}

export const Heading3 = ({ className, children }: Heading3Props) => {

  return (
    <h3 className={cn("font-medium text-star-dust-200 text-sm leading-8", className)}>
      { children }
    </h3>
  )
}
