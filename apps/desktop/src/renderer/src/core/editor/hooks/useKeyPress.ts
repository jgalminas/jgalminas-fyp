import { useEffect } from "react"

export type useKeyPressProps = {
  key: string,
  callback: () => void,
  deps?: any[]
}

export const useKeyPress = ({ key, callback, deps = [] }: useKeyPressProps) => {
  
  useEffect(() => {

    const handlePress = (e: KeyboardEvent) => {
      if (e.code.toLowerCase() === key) {
        callback();
      }
    }

    document.addEventListener("keypress", handlePress);

    return () => document.removeEventListener("keypress", handlePress);
  }, deps)
}