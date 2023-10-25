import { cn } from "@fyp/class-name-helper";
import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

export type InputProps = {
  className?: string,
  label?: string,
  error?: string | undefined
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef(({ error, label, className, ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {
  
  const Error = <p className="text-red-600 text-sm"> { error } </p>;
  const Label = <label htmlFor={rest?.name} className="text-sm font-medium text-gray-500"> { label } </label>;

  return (
    <div className="flex flex-col gap-1.5">
      { label && Label }
      <input ref={ref} {...rest}
      className={cn(`border py-1.5 px-2 border-gray-300 rounded focus:ring focus:border-blue-500 
      ring-blue-200 outline-none text-gray-700 transition-colors`, className)}/>
      { error && Error }
    </div>
  )
})

export default Input;