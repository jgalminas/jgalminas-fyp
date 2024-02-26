import { aggregateTeamKills, calcCSPM, calcKDA, calcKP } from "./stats";

describe("Stats Utilities Tests", () => {

  describe("calcKDA", () => {

    test('Should calculate KDA correctly when deaths are 0', () => {
      const stats = { kills: 10, assists: 5, deaths: 0 };
      expect(calcKDA(stats)).toBe(15);
    });

    test('Should calculate KDA correctly when deaths are not 0', () => {
      const stats = { kills: 10, assists: 5, deaths: 2 };
      expect(calcKDA(stats)).toBeCloseTo(7.5);
    });

    test('Should calculate KDA correctly when deaths are 0 and there are no assists', () => {
      const stats = { kills: 10, assists: 0, deaths: 0 };
      expect(calcKDA(stats)).toBe(10);
    });

    test('Should return 0 when all stats are 0', () => {
      const stats = { kills: 0, assists: 0, deaths: 0 };
      expect(calcKDA(stats)).toBe(0);
    });

  })

  describe('aggregateTeamKills', () => {

    const blueTeamParticipants = [
      { kills: 5, team: 'BLUE' },
      { kills: 3, team: 'BLUE' },
      { kills: 2, team: 'BLUE' },
    ]
  
    const redTeamParticipants = [
      { kills: 4, team: 'RED' },
      { kills: 2, team: 'RED' },
      { kills: 1, team: 'RED' },
    ]
  
    test('Should aggregate kills correctly for blue team', () => {
      // @ts-expect-error
      expect(aggregateTeamKills(blueTeamParticipants, 'BLUE')).toBe(10);
    })
  
    test('Should aggregate kills correctly for red team', () => {
      // @ts-expect-error
      expect(aggregateTeamKills(redTeamParticipants, 'RED')).toBe(7);
    })
  
    test('Should return 0 for non-existent team', () => {
      // @ts-expect-error
      expect(aggregateTeamKills(blueTeamParticipants, 'GREEN')).toBe(0);
    })
  
    test('Should return 0 when participants array is empty', () => {
      expect(aggregateTeamKills([], 'BLUE')).toBe(0);
    })
  })

  describe('calcKP', () => {
    test('Should calculate KP correctly', () => {
      expect(calcKP(5, 3, 20)).toBe('40%');
    });
  
    test('Should return 0% when there are no team kills', () => {
      expect(calcKP(5, 3, 0)).toBe('0%');
    });
  
    test('Should handle division by zero gracefully', () => {
      expect(calcKP(5, 3, 0)).toBe('0%');
    });
  
    test('Should handle fractional percentages correctly', () => {
      expect(calcKP(2, 1, 7)).toBe('42.86%');
    });
  });

  describe('calcCSPMn', () => {

    test('Should calculate CSPM correctly', () => {
      expect(calcCSPM(200, 2400)).toBe('0.08');
    })
  
    test('Should return 0 when CS or game duration is 0', () => {
      expect(calcCSPM(0, 2400)).toBe('0');
    })
  
    test('Should handle fractional CSPM correctly', () => {
      expect(calcCSPM(250, 1800)).toBe('0.14');
    })
  
  })

});