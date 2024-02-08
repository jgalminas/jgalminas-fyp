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

export type Settings = z.infer<typeof settingsSchema>;

export const FPS_OPTIONS = {
  30: "30 FPS",
  60: "60 FPS"
} as const

export const RESOLUTION_OPTIONS = {
  4000: "720p",
  6000: "1080p",
  10000: "1440p",
  16000: "4K"
} as const

export const TIMEFRAME_OPTIONS = {
  15: "15 Seconds",
  30: "30 Seconds",
  45: "45 Seconds",
  60: "60 Seconds",
  120: "120 Seconds"
} as const

export const defaultSettings: Settings = {
  frameRate: Number(Object.keys(FPS_OPTIONS)[0]),
  highlightTimeframe: Number(Object.keys(TIMEFRAME_OPTIONS)[1]),
  recordMic: false,
  resolution: Number(Object.keys(RESOLUTION_OPTIONS)[1]),
  shortcutKey: {
    key: 'F5',
    shiftKey: true,
    ctrlKey: false
  }
}