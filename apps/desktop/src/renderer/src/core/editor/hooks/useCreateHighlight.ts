import { IRecording } from "@fyp/types";

export type useCreateHighlightProps = {
  recording: IRecording & { match: string }
  start: number,
  finish: number,
  onCreate: () => void,
  onSuccess: (id: string) => void,
  onFailure: (message: string) => void
}

export const useCreateHighlight = ({ recording, start, finish, onCreate, onSuccess, onFailure }: useCreateHighlightProps) => {

  const create = async() => {
    onCreate();  
    const result = await window.api.file.createHighlight({
      recording,
      timeframe: {
        frame: 0,
        start,
        finish,
        tags: []
      }
    })

    if (result.status === "OK") {
      onSuccess(result.id);
    } else {
      onFailure(result.message);
    }

  };

  return { create }
}