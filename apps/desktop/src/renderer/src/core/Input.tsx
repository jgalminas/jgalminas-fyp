import { cn } from "@fyp/class-name-helper";
import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

export type InputProps = {
  className?: string,
  label?: string,
  error?: string | undefined
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef(({ error, label, className, ...rest }: InputProps, ref: ForwardedRef<HTMLInputElement>) => {

  const Error = <p className="text-accent-red text-sm"> { error } </p>;
  const Label = <label htmlFor={rest?.name} className="text-sm font-medium text-star-dust-300"> { label } </label>;

  return (
    <div className="flex flex-col gap-1.5">
      { label && Label }
      <input ref={ref} {...rest}
      className={cn(`border py-2 px-2 border-woodsmoke-100 rounded-md focus:ring focus:border-science-blue-600 placeholder-star-dust-500
      ring-woodsmoke-200 outline-none text-star-dust-200 text-sm bg-woodsmoke-500 transition-colors duration-75`, className)}/>
      { error && Error }
    </div>
  )
})

export default Input;
