import env from "@root/env";

export const api = (path: string) => env.RENDERER_VITE_API_URL + path;