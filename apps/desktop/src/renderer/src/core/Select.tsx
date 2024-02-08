import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import ChevronDown from '@assets/icons/ChevronDown.svg?react';
import { cn } from "@fyp/class-name-helper";
import { useState } from "react";

export type SelectOption = {
  id: string | number,
  value: string | number,
  onClick: (opt: SelectOption) => void
}

export type SelectProps = {
  value: SelectOption,
  className?: string,
  menuClass?: string,
  options: SelectOption[],
  width?: number,
  label?: string,
  name?: string
}

const Select = ({ value, className, options, width, label, name, menuClass }: SelectProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);

  const Label = <label htmlFor={name} className="text-sm font-medium text-star-dust-300"> { label } </label>;

  return (
    <div className="flex flex-col gap-1.5">
      { label && Label }
      <DropdownMenu onOpenChange={(state) => setOpen(state)}>      
        <DropdownMenuTrigger style={{ minWidth: width }} className={cn("bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
        "focus:outline-none text-sm px-3 py-2 min-w-[12rem] w-fit gap-6 rounded-md", className)}>
          { value.value }
          <ChevronDown className={cn("text-star-dust-400 w-5 h-5 ml-auto transition-all", isOpen && "rotate-180")}/>
        </DropdownMenuTrigger>
        <DropdownMenuContent style={{ minWidth: width }} sideOffset={4} className={cn(
          "bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 min-w-[var(--radix-dropdown-menu-trigger-width)] z-50 rounded-md",
          "py-1.5 border max-h-80 overflow-y-auto scrollbar-dark scrollbar-rounded",
          menuClass
        )}>
          { options.map((opt, key) => {
            return (
              <DropdownMenuItem key={opt.id} className="hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer" onClick={() => opt.onClick(options[key])}>
                { opt.value }
              </DropdownMenuItem>
            )
          }) }
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default Select;