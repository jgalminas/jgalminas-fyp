import { app } from "electron";
import { join } from "path";

export const SETTINGS_PATH = join(app.getAppPath(), 'settings.json');
