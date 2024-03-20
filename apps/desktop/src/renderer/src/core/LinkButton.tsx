import { cn } from "@fyp/class-name-helper";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export type LinkButtonProps = {
  to: string,
  className?: string,
  children: ReactNode,
  type?: 'primary' | 'text',
  disabled?: boolean
}

const LinkButton = ({ to, className, children, type = 'primary', disabled = false }: LinkButtonProps) => {

  const isPrimary = type === 'primary';

  return (
    <Link to={to}
    aria-disabled={disabled}
    className={cn(
      "h-fit w-fit px-3.5 py-1.5 text-white rounded-sm2 text-sm font-medium transition-colors",
      isPrimary ? "bg-science-blue-600 hover:bg-science-blue-700" : "hover:bg-woodsmoke-500",
      disabled && "pointer-events-none opacity-50",
      className
    )}>
      { children }
    </Link>
  )
}

export default LinkButton;
