import { calculateAge, formatDate, parseDateString, pad } from '../dateUtils';

describe('dateUtils', () => {
  describe('pad()', () => {
    it('pads single-digit numbers', () => {
      expect(pad(1)).toBe('01');
      expect(pad(9)).toBe('09');
      expect(pad(10)).toBe('10');
    });
  });

  describe('formatDate()', () => {
    it('formats dates in DD/MM/YYYY by default', () => {
      expect(formatDate(5, 4, 2025, 'DD/MM/YYYY')).toBe('05/04/2025');
    });

    it('supports MM/DD/YYYY and YYYY/MM/DD', () => {
      expect(formatDate(5, 4, 2025, 'MM/DD/YYYY')).toBe('04/05/2025');
      expect(formatDate(5, 4, 2025, 'YYYY/MM/DD')).toBe('2025/04/05');
    });
  });

  describe('calculateAge()', () => {
    it('calculates age correctly when birthday has passed this year', () => {
      const birth = new Date('1990-01-15');
      const base = new Date('2025-04-05');
      expect(calculateAge(birth, base)).toBe(35);
    });

    it('calculates age correctly when birthday has not yet occurred this year', () => {
      const birth = new Date('1990-12-31');
      const base = new Date('2025-04-05');
      expect(calculateAge(birth, base)).toBe(34);
    });

    it('returns 0 when birth date equals base date', () => {
      const birth = new Date('2025-04-05');
      const base = new Date('2025-04-05');
      expect(calculateAge(birth, base)).toBe(0);
    });
  });

  describe('parseDateString()', () => {
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2025-04-05T00:00:00Z'));
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('parses ISO (YYYY-MM-DD) correctly', () => {
      expect(parseDateString('2020-01-15').toISOString().slice(0, 10)).toBe('2020-01-15');
    });

    it('parses DD-MM-YYYY correctly', () => {
      expect(parseDateString('15-01-2020').toISOString().slice(0, 10)).toBe('2020-01-15');
    });

    it('parses YYYY/MM/DD and DD/MM/YYYY correctly', () => {
      expect(parseDateString('2020/01/15').toISOString().slice(0, 10)).toBe('2020-01-15');
      expect(parseDateString('15/01/2020').toISOString().slice(0, 10)).toBe('2020-01-15');
    });

    it('parses leap-year dates correctly', () => {
      expect(parseDateString('2024-02-29').toISOString().slice(0, 10)).toBe('2024-02-29');
    });

    it('normalizes invalid leap-day input to the next valid date', () => {
      // JS Date normalizes invalid dates (Feb 29 on non-leap years becomes Mar 1)
      expect(parseDateString('2023-02-29').toISOString().slice(0, 10)).toBe('2023-03-01');
    });

    it('parses ISO timestamp strings correctly', () => {
      expect(parseDateString('2020-01-15T00:00:00Z').toISOString().slice(0, 10)).toBe('2020-01-15');
    });

    it('falls back to today for invalid input', () => {
      expect(parseDateString('invalid-date').toISOString().slice(0, 10)).toBe('2025-04-05');
    });

    it('falls back to today when input is null/undefined', () => {
      expect(parseDateString(null).toISOString().slice(0, 10)).toBe('2025-04-05');
      expect(parseDateString(undefined).toISOString().slice(0, 10)).toBe('2025-04-05');
    });
  });
});
