import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageBodyProps = {
  className?: string,
  children?: ReactNode
}

const PageBody = ({ className, children }: PageBodyProps) => {

  return (
    <div className={cn("flex flex-col h-full", className)}>
      { children }
    </div>
  )
}

export default PageBody;