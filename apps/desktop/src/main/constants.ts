import { app } from "electron";
import { join } from "path";
import env from "../env";

export const SETTINGS_PATH = join(app.getAppPath(), 'settings.json');
export const VIDEO_DIRECTORY = env.RENDERER_VITE_RECORDINGS_FOLDER;
