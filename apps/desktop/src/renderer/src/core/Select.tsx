import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import ChevronDown from '@assets/icons/ChevronDown.svg?react';
import { cn } from "@fyp/class-name-helper";
import { useState } from "react";

export type SelectOption = {
  id: string,
  value: string,
  onClick: () => void
}

export type SelectProps = {
  placeholder?: string
  className?: string,
  options: SelectOption[]
}

const Select = ({ placeholder, className, options }: SelectProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu onOpenChange={(state) => setOpen(state)}>      
      <DropdownMenuTrigger className={cn("bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "focus:outline-none text-sm px-3 py-2 min-w-[12rem] w-fit gap-6 rounded-lg", className)}>
        { placeholder }
        <ChevronDown className={cn("text-star-dust-400 w-5 h-5 ml-auto transition-all", isOpen && "rotate-180")}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={cn("bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full mt-1 min-w-[12rem] z-50 rounded-lg",
      "py-1.5 border")}>
        { options.map((opt) => {
          return (
            <DropdownMenuItem key={opt.id} className="hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer" onClick={opt.onClick}>
              { opt.value }
            </DropdownMenuItem>
          )
        }) }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Select;