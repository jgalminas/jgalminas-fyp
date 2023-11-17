import { ReactNode } from "react";

export type PageProps = {
  children: ReactNode
}

const Page = ({ children }: PageProps) => {

  return (
    <div className="flex flex-col gap-7 p-5">
      { children }
    </div>
  )
}

export default Page;