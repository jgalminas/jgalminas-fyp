import { getApiCookieString } from "./cookie";

jest.mock('../', () => ({
  mainWindow: {
    webContents: {
      session: {
        cookies: {
          get: jest.fn()
        }
      }
    }
  }
}));

describe("Cookie Utilities Tests", () => {

  it("Should return a non-empty string", async() => {

    const spy = jest.spyOn(require("../").mainWindow.webContents.session.cookies, "get").mockResolvedValue([
      {
        name: "cookie",
        value: "value"
      }
    ]);

    const result = await getApiCookieString();
    expect(result).toBe("cookie=value");

    spy.mockRestore();
  })

  it("Should return a non-empty string containing multiple cookies", async() => {

    const spy = jest.spyOn(require("../").mainWindow.webContents.session.cookies, "get").mockResolvedValue([
      {
        name: "cookie",
        value: "value"
      },
      {
        name: "cookie2",
        value: "value2"
      }
    ]);

    const result = await getApiCookieString();
    expect(result).toBe("cookie=value; cookie2=value2");

    spy.mockRestore();
  })

  it("Should return an empty string if no cookies are found", async() => {
    const result = await getApiCookieString();
    expect(result).toBe("");
  })

})