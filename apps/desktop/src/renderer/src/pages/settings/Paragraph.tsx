import { cn } from "@fyp/class-name-helper"
import { ReactNode } from "react"

export type ParagraphProps = {
  children?: ReactNode,
  className?: string
}

export const Paragraph = ({ className, children }: ParagraphProps) => {

  return (
    <p className={cn("text-sm text-star-dust-400", className)}>
      { children }
    </p>
  )
}
