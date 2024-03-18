import { readFile, writeFile } from "fs/promises";
import { Settings, defaultSettings, settingsSchema } from "../shared/settings";

export class SettingsManager {

  private settings: Settings | undefined;
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  public async loadSettings() {
    try {
      const file = await readFile(this.path, 'utf-8');
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
    await writeFile(this.path, JSON.stringify(settings));    
  }

  public getSettings() {
    return this.settings;
  }

}