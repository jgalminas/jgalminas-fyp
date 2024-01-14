
export const  fileSize = (size: number): string[] => {
  const kilobyte = 1024;
  const megabyte = kilobyte * 1024;
  const gigabyte = megabyte * 1024;

  if (size < kilobyte) {
      return [size.toString(), 'B'];
  } else if (size < megabyte) {
      return [(size / kilobyte).toFixed(2), 'Kb'];
  } else if (size < gigabyte) {
      return [(size / megabyte).toFixed(2), 'Mb'];
  } else {
      return [(size / gigabyte).toFixed(2), 'Gb'];
  }
}