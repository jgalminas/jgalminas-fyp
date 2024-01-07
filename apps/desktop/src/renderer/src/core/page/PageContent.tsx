import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageContentProps = {
  className?: string,
  children: ReactNode
}

const PageContent = ({ className, children }: PageContentProps) => {

  return (
    <div className={cn("flex flex-col gap-5 h-full", className)}>
      { children }
    </div>
  )
}

export default PageContent;