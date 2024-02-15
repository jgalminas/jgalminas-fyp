import { IRecording } from "@fyp/types";
import { useState } from "react";

export type useCreateHighlightProps = {
  recording: IRecording & { match: string }
  start: number,
  finish: number,
  onCreate: () => void
}

export const useCreateHighlight = ({ recording, start, finish, onCreate }: useCreateHighlightProps) => {

  const [isCreating, setIsCreating] = useState<boolean>(false);

  const create = async() => {
    setIsCreating(true);
    onCreate();  
    await window.api.file.createHighlight({
      recording,
      timeframe: {
        frame: 0,
        start,
        finish,
        tags: []
      }
    })
    setIsCreating(false);
  };

  return { create, isCreating }
}