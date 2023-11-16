import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";

export type CardProps = {
  className?: string,
  children: ReactNode
}

const Card = ({ children, className }: CardProps) => {

  return (
    <div className={cn("bg-woodsmoke-700 rounded-lg p-5", className)}>
      { children }
    </div>
  )
}

export default Card;