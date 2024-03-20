import { cn } from "@fyp/class-name-helper";
import { HTMLDataAttributes } from "@renderer/types";
import { ReactNode } from "react";

export type CardProps = {
  className?: string,
  children: ReactNode
} & HTMLDataAttributes

const Card = ({ children, className, ...rest }: CardProps) => {

  return (
    <div {...rest} className={cn("bg-woodsmoke-700 rounded-lg p-5", className)}>
      { children }
    </div>
  )
}

export default Card;
