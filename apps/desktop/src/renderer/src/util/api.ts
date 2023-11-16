import env from "@root/env";

export const api = (path: string) => env.VITE_API_URL + path;