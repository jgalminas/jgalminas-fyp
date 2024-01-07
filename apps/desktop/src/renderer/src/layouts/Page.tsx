import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageProps = {
  children: ReactNode,
  className?: string
}

const Page = ({ className, children }: PageProps) => {

  return (
    <div className={cn("flex flex-col gap-7 pb-5", className)}>
      { children }
    </div>
  )
}

export default Page;