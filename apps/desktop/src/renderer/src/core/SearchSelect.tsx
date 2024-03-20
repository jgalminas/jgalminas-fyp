import { cn } from "@fyp/class-name-helper";
import { MouseEvent, useState } from "react";
import Divider from "./page/Divider";
import ChevronDown from '@assets/icons/ChevronDown.svg?react';
import Search from '@assets/icons/Search.svg?react';
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { ViewportList } from "react-viewport-list";
import X from "@assets/icons/X.svg?react";
import RoundImage from "./RoundImage";

export type SearchSelectOption = {
  id: string,
  value: string,
  imageUrl?: string,
  onClick: (value: SearchSelectOption) => void
}

export type SearchSelectProps = {
  value: SearchSelectOption,
  className?: string,
  withIcons?: boolean,
  options: SearchSelectOption[]
}

const SearchSelect = ({ value, className, options, withIcons = false }: SearchSelectProps) => {

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

  const clear = (e: MouseEvent) => {
    e.stopPropagation();
    options[0].onClick(options[0]);
    setOpen(false);
    setSearch("");
  }

  const filteredOptions = options.filter(opt => opt.value.toLowerCase().includes(search.toLowerCase()));
  const isFirst = options.findIndex(i => i.id === value.id) === 0;

  return (
    <Popover onOpenChange={onOpenChange} open={isOpen}>
      <PopoverTrigger data-test-id="search-select" className={cn("bg-woodsmoke-400 text-star-dust-300 border-woodsmoke-50 border flex items-center",
      "text-sm min-h-[38px] px-3 min-w-[12rem] w-fit gap-6 rounded-md", className)}>
        <div className="flex items-center gap-3">
          { withIcons && value.imageUrl && <RoundImage alt={`image of ${value.value}`} className="h-6 w-6 border-none" src={value.imageUrl}/> }
          <span className="truncate text-ellipsis max-w-24">
            { value.value }
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          { !isFirst &&
            <span role="button" aria-label="clear" onClick={clear} className="p-0.5 hover:bg-woodsmoke-600 rounded-full">
              <X className="w-3.5 h-3.5"/>
            </span>
          }
          <ChevronDown className={cn("text-star-dust-400 w-5 h-5 transition-all", isOpen && "rotate-180")}/>
        </div>
      </PopoverTrigger>

      <PopoverContent data-test-id="search-select-content" className={cn("bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full mt-1 min-w-[12rem] z-50 rounded-md",
      "py-1.5 border ")}>
        <div className="w-[188px] mx-[1px] hover:bg-woodsmoke-500 relative">
          <input autoFocus placeholder="Search" onChange={(e) => setSearch(e.target.value)}
          className="bg-inherit focus:outline-2 pl-8 p-1.5 w-full focus:outline  outline-science-blue-600"/>
          <Search className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-4"/>
        </div>

        <Divider className="mt-2 border-woodsmoke-50"/>

        <ul className="max-h-80 overflow-y-auto scrollbar-dark scrollbar-rounded">
          <ViewportList items={filteredOptions} overscan={1}>
            { (opt, key) => {
              const isSelected = opt.id === value?.id;
              return (
                <li key={key} onClick={() => onClick(opt)}
                className={cn("hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer flex items-center gap-3", isSelected && "bg-woodsmoke-50")}>
                  { withIcons && opt.imageUrl ?
                    <RoundImage alt={`image of ${opt.value}`} className="w-7 h-7 border-none" src={opt.imageUrl}/>
                    : <div className="ml-7"/>
                  }
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
