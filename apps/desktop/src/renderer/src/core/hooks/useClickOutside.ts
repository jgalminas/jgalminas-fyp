import { useEffect, useRef } from "react";

/**
 * A hook that executes a callback function when a mouse click occurs outside of the target element.
 * @param nodeRef React Ref of a node which is the target element.
 * @param callback The function that is to be executed upon clicking outside.
 */
export const useClickOutside = <T extends HTMLElement>({
    callback,
    enabled = true
}: {
    callback: (() => void) | undefined,
    enabled?: boolean
}) => {

    const nodeRef = useRef<T>(null);

    useEffect(() => {
        
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;            
            if (enabled && !nodeRef.current?.contains(target)) {    
                callback && callback();                
            }
        }
        
        document.addEventListener("mousedown", handleClick);
        return () => {
        document.removeEventListener("mousedown", handleClick);
    }

    }, [])

    return { nodeRef }
}