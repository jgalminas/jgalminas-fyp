import { cn } from "@fyp/class-name-helper";

export type DividerProps = {
  className?: string
}

const Divider = ({ className }: DividerProps) => {

  return (
    <hr className={cn("border-woodsmoke-200", className)}/>
  )
}

export default Divider;