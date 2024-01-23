import { cn } from "@fyp/class-name-helper";
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useClickOutside } from "../hooks/useClickOutside";

export type ModalProps = {
  className?: string,
  children?: ReactNode,
  onClose?: () => void
}

const Modal = ({ className, children, onClose }: ModalProps) => {

  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById('page'));
  }, [])

  const { nodeRef }  = useClickOutside<HTMLDivElement>(onClose);

  if (target) {
    return createPortal(
      <div className="absolute w-full h-screen bg-black bg-opacity-[15%] top-0 right-0 flex items-center justify-center z-50">
        <div ref={nodeRef} className={cn("w-[80%] h-[80%] bg-woodsmoke-500", className)}>
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