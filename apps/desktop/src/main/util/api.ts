import env from "../../env";

export const api = (url: string) => env.RENDERER_VITE_API_URL + url;