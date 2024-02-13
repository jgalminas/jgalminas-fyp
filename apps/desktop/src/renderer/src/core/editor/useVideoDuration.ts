import { RefObject, useEffect } from "react";

export type useVideoDurationProps = {
  ref: RefObject<HTMLVideoElement>,
  setDuration: (value: number) => void
}

export const useVideoDuration = ({ ref, setDuration }: useVideoDurationProps) => {

  useEffect(() => {
    const updateDudarion = () => {
      if (ref.current) {
        setDuration(ref.current.duration);
      }
    };
  
    if (ref.current) {
      ref.current.addEventListener('loadedmetadata', updateDudarion);
    }
  
    return () => {
      if (ref.current) {
        ref.current.removeEventListener('loadedmetadata', updateDudarion);
      }
    };
  }, []);

}
