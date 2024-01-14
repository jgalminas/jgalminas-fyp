
export enum RecorderIPC {
  Start = "recorder:start",
  Finish = "recorder:finish",
  Response = "recorder:finish:response"
}

export enum FileIPC {
  GetThumbnail = "file:thumbnail:get"
}

export enum PathIPC {
  Get = "path:get"
}

export enum ClientIPC {
  Player = "client:player",
  Status = "client:status"
}