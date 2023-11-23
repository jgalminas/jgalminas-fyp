import { LolApi } from "twisted";

export const lolApi = new LolApi(process.env.MAIN_VITE_LOL_KEY as string);
