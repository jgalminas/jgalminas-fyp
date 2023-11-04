import { ReactNode } from "react";

export type PageProps = {
  children: ReactNode
}

const Page = ({ children }: PageProps) => {

  return (
    <div className="p-5">
      { children }
    </div>
  )
}

export default Page;