import { DropdownMenu, DropdownMenuContent, DropdownMenuContentProps, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type DropdownOption = {
  id: string,
  value: string,
  onClick: () => void
}

export type DropdownProps = {
  align?: DropdownMenuContentProps['align']
  trigger: ReactNode,
  className?: string,
  options: DropdownOption[]
}

const IconSelect = ({ trigger, className, options, align = "center" }: DropdownProps) => {

  return (
    <DropdownMenu>      
      <DropdownMenuTrigger className={cn("hover:bg-woodsmoke-500 focus:outline-none", className)}>
        { trigger }
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={cn("bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full mt-1 min-w-[12rem] z-50 rounded-lg",
      "py-1.5 border")}>
        { options.map((opt) => {
          return (
            <DropdownMenuItem key={opt.id} className="hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer focus:outline-none" onClick={opt.onClick}>
              { opt.value }
            </DropdownMenuItem>
          )
        }) }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default IconSelect;