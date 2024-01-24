import { cn } from "@fyp/class-name-helper";
import { DefaultHeader } from "@renderer/navigation/DefaultHeader";
import { Fragment, ReactNode } from "react";

export type PageProps = {
  children: ReactNode,
  pageClass?: string,
  contentClass?: string,
  header?: ReactNode
}

const Page = ({ pageClass, contentClass, children, header }: PageProps) => {

  const headerComponent = header ? header : <DefaultHeader/>

  return (
    <Fragment>
      { headerComponent }
      <div className="flex flex-col overflow-y-auto w-full">
        <div className={cn("w-full max-w-[60rem] self-center", pageClass)}>
          <div className={cn("flex flex-col gap-7 pb-5", contentClass)}>
            { children }
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default Page;