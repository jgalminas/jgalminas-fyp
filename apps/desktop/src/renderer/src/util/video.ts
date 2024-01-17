import env from "@root/env";

export const videoUrl = (id: string) => env.RENDERER_VITE_VIDEO_SERVER_URL + '/video/' + id;