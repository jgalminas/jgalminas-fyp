import { cn } from "@fyp/class-name-helper";
import { useState } from "react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";

export type SidebarProps = {
  className?: string
}

const Sidebar = ({ className }: SidebarProps) => {

  const [isOpen, setOpen] = useState<boolean>(true);

  const handleMinimise = () => setOpen(!isOpen);

  return (
    <div className={cn("flex flex-col transition-all border-r border-slate-200 text-sm", className, isOpen ? "w-60" : "w-16")}>
      <button onClick={handleMinimise} className="bg-slate-600 text-white p-1 rounded h-fit w-fit ml-auto">
        <ChevronLeftIcon className={cn(!isOpen && "rotate-180")}/>
      </button>

      sidebar

    </div>
  )
}

export default Sidebar;