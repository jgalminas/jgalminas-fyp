import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type LinkButtonProps = {
  to: string,
  className?: string,
  children: ReactNode,
  type?: 'primary' | 'text'
}

const LinkButton = ({ to, className, children, type = 'primary' }: LinkButtonProps) => {

  const isPrimary = type === 'primary';

  return (
    <Link to={to} className={cn("h-fit w-fit px-3.5 py-1.5 text-star-dust-200 rounded-sm2 text-sm font-medium transition-colors",
    isPrimary ? "bg-science-blue-600 hover:bg-science-blue-700" : "hover:bg-woodsmoke-500", className)}>
      { children }
    </Link>
  )
}

export default LinkButton;