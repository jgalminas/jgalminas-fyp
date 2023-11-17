
export type PageTitleProps = {
  children: string
}

const PageTitle = ({ children }: PageTitleProps) => {

  return (
    <h1 className="text-star-dust-200 text-2xl font-medium">
      { children }
    </h1>
  )
}

export default PageTitle;