import { round } from "./number";

export const  fileSize = (size: number): string[] => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (size < kilobyte) {
      return [size.toString(), 'B'];
  } else if (size < megabyte) {
      return [round(size / kilobyte), 'Kb'];
  } else if (size < gigabyte) {
      return [round(size / megabyte), 'Mb'];
  } else {
      return [round(size / gigabyte), 'Gb'];
  }
}