import { cn } from "@fyp/class-name-helper";
import { ButtonHTMLAttributes, ForwardedRef, forwardRef } from "react";
import Spinner from '../assets/icons/Spinner.svg?react';

export type ButtonProps = {
  children: string,
  className?: string,
  isLoading?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const Button = forwardRef(({ children, className, isLoading, ...rest }: ButtonProps, ref: ForwardedRef<HTMLButtonElement>) => {
  
  const isDisabled = isLoading || rest.disabled;
  
  return (
    <button disabled={isDisabled} ref={ref} value={children} {...rest}
    className={cn(`bg-blue-600 text-white py-1.5 px-4 rounded cursor-pointer
    hover:bg-blue-700 transition-colors hover:ring ring-blue-200 font-medium
    `, isLoading && "grid grid-cols-[1fr,auto,1fr] gap-2.5", isDisabled && "opacity-80", className)}>
      { isLoading && <Spinner className="fill-white justify-self-end"/> }
      { children }
    </button>
  )
})

export default Button;