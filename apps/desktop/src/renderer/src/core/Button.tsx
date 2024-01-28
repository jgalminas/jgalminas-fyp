import { cn } from "@fyp/class-name-helper";
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";
import Spinner from '../assets/icons/Spinner.svg?react';

export type ButtonProps = {
  children: string,
  className?: string,
  isLoading?: boolean,
  styleType?: "regular" | "text"
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef(({ children, className, isLoading, styleType = "regular", ...rest }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  
  const isDisabled = isLoading || rest.disabled;
  
  return (
    <button disabled={isDisabled} ref={ref} value={children} {...rest}
    className={cn(
      "h-fit w-fit px-3.5 py-1.5 text-star-dust-200 rounded-sm2 text-sm font-medium transition-colors",
      isLoading && "grid grid-cols-[1fr,auto,1fr] gap-2.5",
      isDisabled && "opacity-80",
      styleType === "regular"
      ? "bg-science-blue-600 hover:bg-science-blue-700"
      : "bg-transparent hover:bg-woodsmoke-500",
      className
    )}>
      { isLoading && <Spinner className="fill-star-dust-200 justify-self-end"/> }
      { children }
    </button>
  )
})

export default Button;