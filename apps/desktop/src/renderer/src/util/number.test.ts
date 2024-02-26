import { round } from "./number";

describe("Number Utilities Tests", () => {
  
  it('Should return whole number if number is already whole', () => {
    expect(round(5)).toBe('5');
  })

  it('Should return whole number if number is already whole (negative)', () => {
    expect(round(-5)).toBe('-5');
  })

  it('Should return number rounded to 1 decimal place if decimal is divisible by 10', () => {
    expect(round(3.10)).toBe('3.10');
  })

  it('Should return number rounded to 2 decimal places if the decimal part does not end with 0', () => {
    expect(round(3.14159)).toBe('3.14')
  })

  it('Should return 0 if number is 0', () => {
    expect(round(0)).toBe('0')
  })

})