import { cn } from "@fyp/class-name-helper"
import { useSummoner } from "@renderer/SummonerContext"
import RoundImage from "@renderer/core/RoundImage"
import { Asset } from "@renderer/util/asset"
import { Fragment } from "react"
import { Link } from "react-router-dom"
import Dropdown, { DropdownOption } from "./Dropdown"
import { useAuth } from "@renderer/auth/AuthContext"
import ChevronDown from '@assets/icons/ChevronDown.svg?react';

export type ProfileProps = {
  className?: string
}

export const Profile = ({ className }: ProfileProps) => {

  const { summoner } = useSummoner();
  const { signOut } = useAuth();

  const options: DropdownOption[] = [
    {
      id: 0,
      value: "Sign Out",
      onClick: signOut
    }
  ]

  return (
    <div className={cn(
      "bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "focus:outline-none text-sm p-2 min-w-48 w-fit gap-1.5 rounded-lg",
      className
    )}>
      { summoner
        ?
        <Fragment>
          <RoundImage alt="profile icon" className="border-none outline outline-woodsmoke-50" src={Asset.profileIcon(summoner.profileIconId)}/>
          <div className="mr-6 ml-1.5 flex items-center gap-1">
            <div className="truncate max-w-24">
              <span className="text-star-dust-300 font-medium "> { summoner.name } </span>
            </div>
            <span className="text-star-dust-400 text-xs"> #{ summoner.tag } </span>
          </div>
        </Fragment>
        : <Link to='/settings' className="px-2 rounded-md py-2 hover:bg-woodsmoke-600 mr-auto"> Set profile </Link>
      }
      <Dropdown
      aria-label="Options"
      options={options}
      align="end"
      className="hover:bg-woodsmoke-50 rounded-md p-1">
        { (isOpen) => (
          <ChevronDown className={cn("transition-all h-5 w-5", isOpen && "rotate-180")}/>
        )}
      </Dropdown>
    </div>
  )
}

