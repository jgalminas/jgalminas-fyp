import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type PageProps = {
  children: ReactNode,
  className?: string
}

const Page = ({ className, children }: PageProps) => {

  return (
    <div className="flex flex-col overflow-y-auto w-full">
      <div className={cn("w-full max-w-[60rem] self-center", className)}>
        { children }
      </div>
    </div>

  )
}

export type ContentProps = {
  className?: string,
  children: ReactNode
}

const Content = ({ className, children }: ContentProps) => {
  return (
    <div className={cn("flex flex-col gap-7 pb-5", className)}>
      { children }
    </div>
  )
}

Page.Content = Content;

export default Page;