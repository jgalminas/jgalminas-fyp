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
    <div data-test-id="tabs" className={cn("flex", className)}>
      { tabs.map((tab) => {
        const isActive = location.pathname === tab.href.split('?')[0];
        return (
          <Link {...isActive && { 'data-active': true }} key={tab.href} to={tab.href} className={cn("text-star-dust-300 font-semibold py-4 px-6",
          isActive && "bg-science-blue-600 bg-opacity-[0.07] text-science-blue-500 border-b border-science-blue-500")}>
                { tab.name }
          </Link>
        )
      }) }
    </div>
  )
}

export default Tabs;
