import { cn } from "@fyp/class-name-helper";
import { useState } from "react";
import Divider from "./page/Divider";
import ChevronDown from '@assets/icons/ChevronDown.svg?react';
import Search from '@assets/icons/Search.svg?react';
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { ViewportList } from "react-viewport-list";

export type SearchSelectOption = {
  id: string,
  value: string,
  onClick: (value: SearchSelectOption) => void
}

export type SearchSelectProps = {
  value: SearchSelectOption,
  className?: string,
  options: SearchSelectOption[]
}

const SearchSelect = ({ value, className, options }: SearchSelectProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");

  const onOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      setSearch("");
    }
  }

  const onClick = (opt: SearchSelectOption) => {
    opt.onClick(opt);
    setOpen(false);
    setSearch("");
  }

  const filteredOptions = options.filter(opt => opt.value.toLowerCase().includes(search.toLowerCase()));

  return (
    <Popover onOpenChange={onOpenChange} open={isOpen}>
      <PopoverTrigger className={cn("bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "focus:outline-none text-sm px-3 py-2 min-w-[12rem] w-fit gap-6 rounded-lg", className)}>
        { value.value }
        <ChevronDown className={cn("text-star-dust-400 w-5 h-5 ml-auto transition-all", isOpen && "rotate-180")}/>
      </PopoverTrigger>

      <PopoverContent className={cn("bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full mt-1 min-w-[12rem] z-50 rounded-lg",
      "py-1.5 border ")}>
        <div className="w-[188px] mx-[1px] hover:bg-woodsmoke-500 relative">
          <input autoFocus placeholder="Search" onChange={(e) => setSearch(e.target.value)}
          className="bg-inherit focus:outline-2 pl-8 p-1.5 w-full focus:outline  outline-science-blue-600"/>
          <Search className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-4"/>
        </div>

        <Divider className="mt-2 border-woodsmoke-50"/>

        <ul className="max-h-80 overflow-y-auto">
          <ViewportList items={filteredOptions} overscan={1}>
            { (opt, key) => {
              const isSelected = opt.id === value?.id;
              return (
                <li key={key} onClick={() => onClick(opt)}
                className={cn("hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer", isSelected && "bg-woodsmoke-50")}>
                  { opt.value }
                </li>
              )
            }}
          </ViewportList>
        </ul>
      </PopoverContent>
    </Popover>
  )
}

export default SearchSelect;