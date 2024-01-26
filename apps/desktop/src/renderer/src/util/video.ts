import env from "@root/env";

export const videoUrl = (id: string, type: 'recording' | 'highlight') => env.RENDERER_VITE_VIDEO_SERVER_URL + `/${type}/` + id;