import { z } from "zod";

export const settingsSchema = z.object({
  frameRate: z.number(),
  recordMic: z.boolean(),
  highlightTimeframe: z.number(),
  shortcutKey: z.object({
    key: z.string(),
    ctrlKey: z.boolean(),
    shiftKey: z.boolean()
  }),
  resolution: z.number()
})

export const defaultSettings: Settings = {
  frameRate: 60,
  highlightTimeframe: 30,
  recordMic: false,
  resolution: 1080,
  shortcutKey: {
    key: 'F5',
    shiftKey: true,
    ctrlKey: false
  }
}

export type Settings = z.infer<typeof settingsSchema>;