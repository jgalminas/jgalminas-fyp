import { IpcRendererEvent } from "electron";
import { useEffect } from "react";

export const useIPCSubscription = <T>(channel: string, callback: (event: IpcRendererEvent, data: T) => void, deps: any[] = []) => {

  useEffect(() => {
    const unsubscribe = window.api.events.on(channel, callback);
    return () => unsubscribe();
  }, deps) 

} 
