import Info from '@assets/icons/Info.svg?react';
import { cn } from '@fyp/class-name-helper';

export type InfoMessageProps = {
  children?: string,
  className?: string
}

const InfoMessage = ({ children, className }: InfoMessageProps) => {

  return (
    <div className={cn("text-star-dust-300 flex flex-col items-center justify-center gap-3", className)}>
      <div className="p-3.5 bg-woodsmoke-600 rounded-lg">
        <Info className="w-8 h-8"/>
      </div>
      <p className="text-center text-sm stroke-star-dust-400">
        { children }
      </p>
    </div>
  )
}

export default InfoMessage;