
export const round = (num: number): string => {
  const isWhole = num % 1 === 0;

  if (isWhole) {
      return num.toString();
  } else {
      const decimalPart = num.toString().split('.')[1];
      if (parseInt(decimalPart) % 10 === 0) {
          return num.toFixed(1);
      } else {
          return num.toFixed(2);
      }
  }
}