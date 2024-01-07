import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { cn } from "@fyp/class-name-helper";
import { useRef, useState } from "react";
import Divider from "./page/Divider";
import ChevronDown from '@assets/icons/ChevronDown.svg?react';
import Search from '@assets/icons/Search.svg?react';

export type SearchSelectOption = {
  id: string,
  value: string,
  onClick: (value: SearchSelectOption) => void
}

export type SearchSelectProps = {
  value: SearchSelectOption | null,
  placeholder: string,
  className?: string,
  options: SearchSelectOption[]
}

const SearchSelect = ({ value, className, options, placeholder }: SearchSelectProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  return (
    <DropdownMenu onOpenChange={(state) => setOpen(state)}>      
      <DropdownMenuTrigger className={cn("bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "focus:outline-none text-sm px-3 py-2 min-w-[12rem] w-fit gap-6 rounded-lg", className)}>
        { value?.value ?? placeholder }
        <ChevronDown className={cn("text-star-dust-400 w-5 h-5 ml-auto transition-all", isOpen && "rotate-180")}/>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={cn("bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full mt-1 min-w-[12rem] z-50 rounded-lg",
      "py-1.5 border ")}>

        <div className="w-[188px] mx-[1px] hover:bg-woodsmoke-500 relative">
          <input autoFocus placeholder="Search" onChange={(e) => setSearch(e.target.value)}
          className="bg-inherit focus:outline-2 pl-8 p-1.5 w-full focus:outline  outline-science-blue-600"/>
          <Search className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-4"/>
        </div>

        <Divider className="mt-2 border-woodsmoke-50"/>

        <div className="pt-2 max-h-64 overflow-x-auto">
          { options.filter(opt => opt.value.includes(search)).map((opt) => {
            const isSelected = opt.id === value?.id;
            return (
              <DropdownMenuItem onPointerMove={(e) => e.preventDefault()} onPointerLeave={(e) => e.preventDefault()} key={opt.id}
              className={cn("hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer", isSelected && "bg-woodsmoke-50")} onClick={() => opt.onClick(opt)}>
                { opt.value }
              </DropdownMenuItem>
            )
          }) }
        </div>

      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SearchSelect;