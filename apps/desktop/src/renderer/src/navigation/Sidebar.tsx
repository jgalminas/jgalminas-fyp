import { cn } from "@fyp/class-name-helper";
import SidebarLink from "./SidebarLink";
import Home from '@assets/icons/Home.svg?react';
import Matches from '@assets/icons/Matches.svg?react';
import Highlights from '@assets/icons/Highlights.svg?react';
import Recordings from '@assets/icons/Recordings.svg?react';
import Settings from '@assets/icons/Settings.svg?react';


export type SidebarProps = {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {

  return (
    <div className={cn("flex flex-col gap-6 text-sm w-20 bg-woodsmoke-700 pt-28", className)}>

      <SidebarLink to="/" icon={Home}>
        Home
      </SidebarLink>

      <SidebarLink to="/matches" icon={Matches}>
        Matches
      </SidebarLink>

      <SidebarLink to="/highlights" icon={Highlights}>
        Highlights
      </SidebarLink>

      <SidebarLink to="/recordings" icon={Recordings}>
        Recordings
      </SidebarLink>

      <SidebarLink to="/settings" icon={Settings}>
        Settings
      </SidebarLink>

    </div>
  )
}

export default Sidebar;