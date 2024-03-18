import { cn } from "@fyp/class-name-helper";
import { SVGRIcon } from "@renderer/types";
import { NavLink } from "react-router-dom";

export type SidebarLinkProps = {
  children: string,
  to: string,
  icon: SVGRIcon,
  className?: string
}

const SidebarLink = ({ children, to, icon: Icon, className }: SidebarLinkProps) => {

  return (
    <NavLink className="" to={to}>
      {({ isActive }) => (
        <div className={cn('flex flex-col items-center py-3 gap-1 font-medium text-xs text-star-dust-300', className,
        isActive && 'text-science-blue-500 bg-blue-600 bg-opacity-[0.06] border-r border-blue-500')}>
          <Icon className={cn('text-star-dust-300', isActive && 'text-science-blue-500')}/>
          { children }
        </div>
      )}
    </NavLink>
  )
}

export default SidebarLink;
