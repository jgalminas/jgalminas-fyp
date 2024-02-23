import { useEffect, useRef } from "react";

/**
 * A hook that executes a callback function when a mouse click occurs outside of the target element.
 * @param nodeRef React Ref of a node which is the target element.
 * @param callback The function that is to be executed upon clicking outside.
 */
export const useClickOutside = <T extends HTMLElement>({
    callback,
    exclude = [],
    enabled = true
}: {
    callback: (() => void) | undefined,
    enabled?: boolean
    exclude?: string[]
}) => {

    const nodeRef = useRef<T>(null);

    useEffect(() => {
        
        function handleClick(e: MouseEvent) {
            const target = e.target as HTMLElement;
            
            const isExcluded = exclude.some(id => target.id === id || target.closest(`#${id}`));

            if (enabled && !isExcluded && nodeRef.current && !nodeRef.current.contains(target)) {    
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