import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageInnerHeaderProps = {
  children: ReactNode,
  className?: string
}

const PageInnerHeader = ({ children, className }: PageInnerHeaderProps) => {

  return (
    <div className={cn("flex flex-col gap-5 pt-5", className)}>
      { children }
    </div>
  )
}

export default PageInnerHeader;