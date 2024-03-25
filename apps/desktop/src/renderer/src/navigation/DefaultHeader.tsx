import BackButton from "@renderer/BackButton";
import { Profile } from "@renderer/core/Profile";

export type DefaultHeaderProps = {
  back?: string | -1
}

export const DefaultHeader = ({ back }: DefaultHeaderProps) => {

  return (
    <div className="py-3 px-5 flex z-10 items-center">
      { back && <BackButton to={back}/> }
      <Profile className="ml-auto"/>
    </div>
  )
}
