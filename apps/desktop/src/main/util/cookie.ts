import env from "../../env";
import { mainWindow } from "../index";

export const getApiCookieString = async() => {
  const cookies = await mainWindow?.webContents.session.cookies.get({ url: env.RENDERER_VITE_API_URL });
  return cookies?.map(c => `${c.name}=${c.value}`).join('; ') || '';
};