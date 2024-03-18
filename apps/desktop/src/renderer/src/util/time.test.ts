import { formatMatchLength, formatTimeAgo, timestampToMinutes, length, msToLength, secToLength } from "./time";

describe("Time Utilities Tests", () => {

  describe("formatTimeAgo", () => {

    it('Should return "X seconds ago" when time difference is less than a minute', () => {
      expect(formatTimeAgo(Date.now() - 30000)).toBe(('30 seconds ago'));
    })

    it('Should return "X minutes ago" when time difference is less than an hour', () => {
      expect(formatTimeAgo(Date.now() - 1800000)).toBe('30 minutes ago');
    })

    it('Should return "X hours ago" when time difference is less than a day', () => {
      expect(formatTimeAgo(Date.now() - 7200000)).toBe('2 hours ago');
    })

    it('Should return "X days ago" when time difference is less than a month', () => {
      expect(formatTimeAgo(Date.now() - 259200000)).toBe('3 days ago');
    })

    it('Should return "X months ago" when time difference is less than a year', () => {
      expect(formatTimeAgo(Date.now() - 7889400000)).toBe('2 months ago');
    })

    it('Should return "X years ago" when time difference is greater than a year', () => {
      expect(formatTimeAgo(Date.now() - 31557600000)).toBe('1 year ago');
    })

  })

  describe("formatMatchLength", () => {

    it('Should return minutes and seconds with leading zero', () => {
      expect(formatMatchLength(0, 60000)).toBe('01m 00s');
    });

    it('Should return minutes and seconds with leading zero', () => {
      expect(formatMatchLength(0, 60000)).toBe('01m 00s');
    });
  
    it('Should return hours, minutes and seconds with leading zero', () => {
      expect(formatMatchLength(0, 3665000)).toBe('01h 01m 05s');
    });
  
    it('Should return hours, minutes and seconds (double digits)', () => {
      expect(formatMatchLength(0, 36660000)).toBe('10h 11m 00s');
    });
  
    it('Should return minutes and seconds (double digits)', () => {
      expect(formatMatchLength(0, 605000)).toBe('10m 05s');
    });

  })

  describe("timestampToMinutes", () => {

    test('Should convert a timestamp to minutes correctly', () => {
      expect(timestampToMinutes(300000)).toBe(5);
    })
  
    test('Should return 0', () => {
      expect(timestampToMinutes(0)).toBe(0);
    })
  
    test('Should convert a negative timestamp to negative minutes correctly', () => {
      expect(timestampToMinutes(-300000)).toBe(-5);
    })
  
    test('Should handle NaN input', () => {
      expect(timestampToMinutes(NaN)).toBe(0);
    })
  
    test('Should handle Infinity input', () => {
      expect(timestampToMinutes(Infinity)).toBe(0);
    })
  
    test('should handle Negative Infinity', () => {
      expect(timestampToMinutes(-Infinity)).toBe(0);
    })

  })

  describe("length", () => {

    test('Should convert 65 seconds to "01:05"', () => {
      expect(length(65)).toBe('01:05');
    })
  
    test('Should convert 125 seconds to "02:05"', () => {
      expect(length(125)).toBe('02:05');
    })
  
    test('Should convert 3600 seconds to "01:00:00"', () => {
      expect(length(3600)).toBe('01:00:00');
    })
  
    test('Should convert 0 seconds to "00:00"', () => {
      expect(length(0)).toBe('00:00');
    })
  
    test('Should handle negative number and convert to "00:00"', () => {
      expect(length(-10)).toBe('00:00');
    })

  })

  describe("msToLength", () => {

    test('Should convert 65000 milliseconds to "01:05"', () => {
      expect(msToLength(65000)).toBe('01:05');
    })
  
    test('Should convert 125000 milliseconds to "02:05"', () => {
      expect(msToLength(125000)).toBe('02:05');
    })
  
    test('Should convert 3600000 milliseconds to "01:00:00"', () => {
      expect(msToLength(3600000)).toBe('01:00:00');
    })
  
    test('Should convert 3665000 milliseconds to "01:01:05"', () => {
      expect(msToLength(3665000)).toBe('01:01:05');
    })
  
    test('Should convert 0 milliseconds to "00:00"', () => {
      expect(msToLength(0)).toBe('00:00');
    })
  
    test('Should handle negative number and convert to "00:00"', () => {
      expect(msToLength(-10)).toBe('00:00');
    })

  })
 
  describe("secToLength", () => {

    test('Should convert 65 seconds to "01:05"', () => {
      expect(secToLength(65)).toBe('01:05');
    })
  
    test('Should convert 125 seconds to "02:05"', () => {
      expect(secToLength(125)).toBe('02:05');
    })
  
    test('Should convert 3600 seconds to "01:00:00"', () => {
      expect(secToLength(3600)).toBe('01:00:00');
    })
  
    test('Should convert 3665 seconds to "01:01:05"', () => {
      expect(secToLength(3665)).toBe('01:01:05');
    })
  
    test('Should convert 0 seconds to "00:00"', () => {
      expect(secToLength(0)).toBe('00:00');
    })
  
    test('Should handle negative number and convert to "00:00"', () => {
      expect(secToLength(-10)).toBe('00:00');
    })

  })

})