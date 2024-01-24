import BackButton from "@renderer/BackButton";
import { useAuth } from "../auth/AuthContext";

export type DefaultHeaderProps = {
  back?: string
}

export const DefaultHeader = ({ back }: DefaultHeaderProps) => {

  const { signOut } = useAuth();

  return (
    <div className="py-3 px-5 flex">
      { back && <BackButton to={back}/> }
      <button onClick={signOut} className="ml-auto text-star-dust-300">
        Sign Out
      </button>
    </div>
  )
}