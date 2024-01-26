import { cn } from '@fyp/class-name-helper';
import { Root, Thumb } from '@radix-ui/react-switch';


export type SwitchProps = {
  rootClass?: string,
  thumbClass?: string,
  value: boolean,
  onChange: (value: boolean) => void
}

export const Switch = ({ thumbClass, rootClass, value, onChange }: SwitchProps) => {

  return (
    <Root checked={value} onCheckedChange={onChange} className={cn(
      "w-[42px] h-[25px] bg-blackA6 rounded-full relative data-[state=checked]:bg-star-dust-200 bg-woodsmoke-400 cursor-pointer",
      rootClass
    )}>
      <Thumb className={cn(
        "block w-[21px] h-[21px] data-[state=checked]:bg-woodsmoke-400 bg-star-dust-200 rounded-full",
        "transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[19px]",
        thumbClass
      )} />
    </Root>
  )
}
