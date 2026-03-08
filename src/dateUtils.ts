export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';

export const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

export const formatDate = (day: number, month: number, year: number, format: DateFormat) => {
  const dd = pad(day);
  const mm = pad(month);
  const yyyy = year;

  switch (format) {
    case 'YYYY/MM/DD':
      return `${yyyy}/${mm}/${dd}`;
    case 'MM/DD/YYYY':
      return `${mm}/${dd}/${yyyy}`;
    default:
      return `${dd}/${mm}/${yyyy}`;
  }
};

export const calculateAge = (birthDate: Date, baseDate: Date) => {
  let age = baseDate.getFullYear() - birthDate.getFullYear();
  const m = baseDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && baseDate.getDate() < birthDate.getDate())) age--;
  return age ? age : 0;
};

/**
 * Parses a base date string in common formats (YYYY-MM-DD, DD-MM-YYYY, YYYY/MM/DD, DD/MM/YYYY, etc.)
 * and returns a valid Date. Falls back to `new Date()` when parsing fails.
 */
export const parseDateString = (baseDate?: string | null): Date => {
  if (!baseDate) return new Date();

  let safe = baseDate.toString().trim().replace(/\//g, '-');

  // Detect and fix DD-MM-YYYY (common) → convert to YYYY-MM-DD for Date parsing
  if (/^\d{2}-\d{2}-\d{4}$/.test(safe)) {
    const [dd, mm, yyyy] = safe.split('-');
    safe = `${yyyy}-${mm}-${dd}`;
  }

  const parsed = new Date(safe);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
};
