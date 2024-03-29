import { cn } from "@fyp/class-name-helper";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";
import { Fragment, ReactNode } from "react";

export type PageProps = {
  children?: ReactNode,
  pageClass?: string,
  contentClass?: string,
  header?: ReactNode,
  className?: string
}

const Page = ({ pageClass, contentClass, children, header, className }: PageProps) => {

  const headerComponent = header ? header : <DefaultHeader/>

  return (
    <Fragment>
      { headerComponent }
      <div className={cn("flex flex-col overflow-y-auto w-full px-5 scrollbar-stable", className)}>
        <div id="page" className={cn("w-full max-w-[60rem] self-center", pageClass)}>
          <div className={cn("flex flex-col gap-7", contentClass)}>
            { children }
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Page;