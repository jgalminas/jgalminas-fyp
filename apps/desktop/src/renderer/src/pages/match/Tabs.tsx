import { cn } from "@fyp/class-name-helper"
import { Link, useLocation } from "react-router-dom"

export type Tab = {
  name: string,
  href: string
}

export type TabsProps = {
  tabs: Tab[],
  className?: string
}

const Tabs = ({ tabs, className }: TabsProps) => {

  const location = useLocation();
  
  return (
    <div className={cn("flex", className)}>
      { tabs.map((tab) => {
        const isActive = location.pathname === tab.href;
        return (
          <Link key={tab.href} to={tab.href} className={cn("text-star-dust-300 font-semibold py-4 px-6",
          isActive && "bg-science-blue-600 bg-opacity-15 text-science-blue-600 border-b border-science-blue-600")}>
                { tab.name }
          </Link>
        )
      }) }
    </div>
  )
}

export default Tabs;