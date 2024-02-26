import { join } from "path";
import { unlink, writeFile } from "fs/promises";
import { fileExists } from "./file";
import { existsSync } from "fs";

describe("File Utilities Tests", () => {

  const filePath = join(__dirname, 'file.txt');

  afterEach(async() => {
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  })

  it("Should return true when file exists", async() => {
    await writeFile(filePath, "some text");
    const result = await fileExists(filePath);
    expect(result).toBe(true);
  })

  it("Should false when file doesn't exist", async() => {
    const result = await fileExists(filePath);
    expect(result).toBe(false);
  })

})