import { PathLike, access, constants } from "fs";

export const fileExists = (path: PathLike): boolean => {
  let result: boolean = false;
  access(path, constants.F_OK, (err) => {
    result = err ? false : true;
  });
  return result;
}