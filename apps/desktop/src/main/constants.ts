import { app } from "electron";
import { join } from "path";

export const SETTINGS_PATH = join(app.getAppPath(), 'settings.json');
export const VIDEO_DIRECTORY = import.meta.env.RENDERER_VITE_RECORDINGS_FOLDER;
