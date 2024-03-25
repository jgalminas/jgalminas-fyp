import { cn } from "@fyp/class-name-helper";
import { MouseEvent, ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

export type LinkButtonProps = {
  to: string | - 1,
  className?: string,
  children: ReactNode,
  type?: 'primary' | 'text',
  disabled?: boolean
}

const LinkButton = ({ to, className, children, type = 'primary', disabled = false }: LinkButtonProps) => {

  const navigate = useNavigate();
  const isPrimary = type === 'primary';

  const onClick = (e: MouseEvent) => {
    if (to === -1) {
      e.preventDefault();
      navigate(to);
    }
  }

  return (
    <Link to={to as string}
    aria-disabled={disabled}
    onClick={onClick}
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
