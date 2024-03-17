import { DropdownMenu, DropdownMenuContent, DropdownMenuContentProps, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuPortal } from "@radix-ui/react-dropdown-menu";
import { cn } from "@fyp/class-name-helper";
import { AriaAttributes, ReactNode, useState } from "react";

export type DropdownOption = {
  id: string | number,
  value: string,
  onClick: () => void
}

export type DropdownProps = {
  align?: DropdownMenuContentProps['align']
  children: (isOpen: boolean) => ReactNode,
  className?: string,
  options: DropdownOption[]
} & AriaAttributes

const Dropdown = ({ children, className, options, align = "center", ...rest }: DropdownProps) => {

  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <DropdownMenu onOpenChange={(v) => setOpen(v)}>
      <DropdownMenuTrigger aria-label={rest["aria-label"]} className={cn("hover:bg-woodsmoke-500", className)}>
        { children(isOpen) }
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align={align} sideOffset={4}
        className={cn(
          "bg-woodsmoke-400 border-woodsmoke-50 text-sm text-star-dust-300 w-full min-w-[12rem]",
          "py-1.5 border z-[999] rounded-lg")
        }>
          { options.map((opt) => {
            return (
              <DropdownMenuItem key={opt.id} className="hover:bg-woodsmoke-500 px-3 py-2 cursor-pointer focus:outline-none" onClick={opt.onClick}>
                { opt.value }
              </DropdownMenuItem>
            )
          }) }
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}

export default Dropdown;
