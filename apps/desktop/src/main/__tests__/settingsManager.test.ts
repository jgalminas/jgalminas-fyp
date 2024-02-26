import { SettingsManager } from "../settingsManager";
import { join } from "path";
import { writeFile, unlink, readFile } from "fs/promises"; 
import { defaultSettings } from "../../shared/settings";
import { existsSync } from "fs";

describe("Settings Manager Tests", () => {

  const settingsPath = join(__dirname, 'settings.json');

  afterEach(async() => {
    if (existsSync(settingsPath)) {
      await unlink(settingsPath);
    }
  })

  it("Should load settings successfully", async() => {
    
    const settings = {
      frameRate: 60,
      highlightTimeframe: 30,
      recordMic: false,
      resolution: 6000,
      shortcutKey: { key: "F", ctrlKey: true, shiftKey: false }
    }

    await writeFile(settingsPath, JSON.stringify(settings));

    const settingsManager = new SettingsManager(settingsPath);
    await settingsManager.loadSettings();

    const loadedSettings = settingsManager.getSettings();

    expect(loadedSettings).toMatchObject(settings);
  })

  it("Should set default settings if settings file doesn't exist", async() => {
    const settingsManager = new SettingsManager(settingsPath);
    await settingsManager.loadSettings();

    const loadedSettings = settingsManager.getSettings();

    expect(loadedSettings).toMatchObject(defaultSettings); 
  })

  it("Should set default settings if settings file failed to load or the schema is incorrect", async() => {

    const settings = {
      frameRate: 60,
      highlightTimeframe: "30",
      resolution: 6000,
      shortcutKey: { key: "F", ctrlKey: true, shiftKey: false }
    }

    await writeFile(settingsPath, JSON.stringify(settings));

    const settingsManager = new SettingsManager(settingsPath);
    await settingsManager.loadSettings();

    const loadedSettings = settingsManager.getSettings();

    expect(loadedSettings).toMatchObject(defaultSettings); 
  })

  it("Should update settings in memory and in the persisted file", async() => {
    const settingsManager = new SettingsManager(settingsPath);

    const settings = {
      frameRate: 60,
      highlightTimeframe: 30,
      recordMic: false,
      resolution: 6000,
      shortcutKey: { key: "F", ctrlKey: true, shiftKey: false }
    }
  
    await settingsManager.setSettings(settings);

    const file = await readFile(settingsPath, 'utf-8');
    const fileSettings = JSON.parse(file);

    const loadedSettings = settingsManager.getSettings();

    expect(loadedSettings).toMatchObject(settings);
    expect(fileSettings).toMatchObject(settings);
  })

})