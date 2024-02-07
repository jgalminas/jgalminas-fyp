import { ReactNode } from "react"
import { Provider, Root, Trigger, Portal, Content, Arrow } from "@radix-ui/react-tooltip";
import { cn } from "@fyp/class-name-helper";

export type WithTooltipProps = {
  children?: ReactNode,
  tooltip?: ReactNode,
  className?: string,
  arrowClass?: string
}

export const WithTooltip = ({ children, tooltip, className, arrowClass }: WithTooltipProps) => {

  return (
    <Provider>
      <Root>
        <Trigger asChild>
          { children }
        </Trigger>
        <Portal>
          <Content
            className={cn(
              "data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade",
              "data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade",
              "data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade",
              "data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade",
              "text-violet11 select-none rounded-[4px] bg-woodsmoke-100 px-[15px] py-[10px]",
              "text-[15px] leading-none shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
              "will-change-[transform,opacity] text-star-dust-200 text-sm z-50 drop-shadow-md",
              className
              )}
            sideOffset={5}
          >
            { tooltip }
            <Arrow className={cn("fill-woodsmoke-100", arrowClass)} />
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}
