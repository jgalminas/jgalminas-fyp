import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageHeaderProps = {
  children: ReactNode,
  className?: string
}

const PageHeader = ({ children, className }: PageHeaderProps) => {

  return (
    <div className={cn("flex flex-col gap-5 pt-5", className)}>
      { children }
    </div>
  )
}

export default PageHeader;