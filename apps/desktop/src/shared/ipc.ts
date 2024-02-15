
export enum RecorderIPC {
  Start = "recorder:start",
  Finish = "recorder:finish",
  Response = "recorder:finish:response"
}

export enum FileIPC {
  GetThumbnail = "file:thumbnail:get",
  CreateHighlights = "file:highlight:create:many",
  CreateHighlight = "file:highlight:create:single"
}

export enum PathIPC {
  Get = "path:get"
}

export enum ClientIPC {
  Player = "client:player",
  Status = "client:status"
}

export enum HighlightIPC {
  Created = "highlight:created"
}

export enum RecordingIPC {
  Created = "recording:created"
}

export enum SettingsIPC {
  Get = "settings:get",
  Set = "settings:set"
}