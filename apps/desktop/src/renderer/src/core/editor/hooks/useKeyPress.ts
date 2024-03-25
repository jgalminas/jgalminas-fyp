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
        e.preventDefault();
        callback();
      }
    }

    document.addEventListener("keydown", handlePress);

    return () => document.removeEventListener("keydown", handlePress);
  }, deps)
}
