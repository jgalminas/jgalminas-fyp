import { cn } from "@fyp/class-name-helper";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../hooks/useClickOutside";
import { HTMLDataAttributes } from "@renderer/types";

export type ModalProps = {
  className?: string,
  children?: ReactNode,
  onClose?: () => void,
  clickOutside?: boolean,
  backdropClass?: string
} & HTMLDataAttributes

const Modal = ({ className, children, onClose, backdropClass, clickOutside = true, ...rest }: ModalProps) => {

  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById('page'));
  }, [])

  const { nodeRef }  = useClickOutside<HTMLDivElement>({
    callback: onClose,
    enabled: clickOutside,
    exclude: ["sidebar"]
  });

  if (target) {
    return createPortal(
      <div className={cn("absolute w-full h-screen bg-black bg-opacity-[0.5] top-0 right-0 flex items-center justify-center z-50", backdropClass)}>
        <div {...rest} ref={nodeRef} className={cn("w-[80%] h-[80%] bg-woodsmoke-700 shadow-[0_0_100px_40px_rgba(0,0,0,0.4)]", className)}>
          { children }
        </div>
      </div>,
      target
    )
  } else {
    return null;
  }

}

export default Modal;
