import { readFile, writeFile } from "fs/promises";
import { app } from "electron";
import path from "path";
import { Settings, defaultSettings, settingsSchema } from "../shared/settings";


const SETTINGS_PATH = path.join(app.getAppPath(), 'settings.json');

export class SettingsManager {

  settings: Settings | undefined;

  public async loadSettings() {
    try {
      const file = await readFile(SETTINGS_PATH, 'utf-8');
      const parsed = await settingsSchema.safeParseAsync(JSON.parse(file));

      if (parsed.success) {
        this.settings = parsed.data;
      } else {
        this.settings = defaultSettings;
      }

    } catch {
      this.settings = defaultSettings;
    }
  }

  public async setSettings(settings: Settings) {
    this.settings = settings;
    await writeFile(SETTINGS_PATH, JSON.stringify(settings));    
  }

  public getSettings() {
    return this.settings;
  }

}