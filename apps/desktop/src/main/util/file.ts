import { PathLike, access, constants } from "fs";

export const fileExists = (path: PathLike): Promise<boolean> => {
  return new Promise((resolve) => {
    access(path, constants.F_OK, (err) => {
      resolve(err ? false : true);
    });
  })
}