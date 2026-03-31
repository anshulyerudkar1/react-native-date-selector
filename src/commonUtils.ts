
export const formatedDate = (dob: string | Date | null | undefined): string => {
    console.log("Formatting DOB: ", dob);
  if (!dob) return "";  // null, undefined, ""

  const cleanDob = dob.toString().trim();

  // CASE 1: Only YYYY (e.g., "1965")
  if (/^\d{4}$/.test(cleanDob)) {
    //console.log("DOB is only year: ", cleanDob);
    return cleanDob;
  }

  // CASE 2: dd/mm/yyyy input
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(cleanDob)) {
    //console.log("DOB is already dd/mm/yyyy: ", cleanDob);
    return cleanDob;
  }

  // CASE 3: ISO format → convert to dd/mm/yyyy
  if (/^\d{4}-\d{2}-\d{2}T/.test(cleanDob)) {
    try {
      const d = new Date(cleanDob);
      if (isNaN(d.getTime())) return "";

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      //console.log("Converted ISO DOB to dd/mm/yyyy: ", `${day}/${month}/${year}`);

      return `${day}/${month}/${year}`;
    } catch {
        //console.log("Error parsing ISO DOB: ", cleanDob);
      return "";
    }
  }

  // CASE 4: yyyy-mm-dd (no time)
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDob)) {
    try {
      const [y, m, d] = cleanDob.split("-");
      //console.log("Converted yyyy-mm-dd DOB to dd/mm/yyyy: ", `${d}/${m}/${y}`);
      return `${d}/${m}/${y}`;
    } catch {
        //console.log("Error parsing yyyy-mm-dd DOB: ", cleanDob);
      return "";
    }
  }

  // Anything else = invalid
  return "";
};

export const yyyyMMddHHmmssConvertDateddMMyyyy = (value: string): string => {
  if (!value || value.length < 8) return "";

  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);

  return `${day}/${month}/${year}`;
};

export const parseDateToISO = (dateStr: string): string | null => {
  if (!dateStr) return null;

  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  return new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day)
  )).toISOString();
};

const parseDDMMYYYY = (value: string): Date => {
  const parts = value.split('/');
  if (parts.length !== 3) return new Date(NaN);

  const day = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const year = Number(parts[2]);

  return new Date(year, month, day);
};

export const isDateWithinDays = (date: string | Date, days: number): boolean => {
    if (!date || !days) return false;

    const selectedDate =
        typeof date === 'string' && date.includes('/')
            ? parseDDMMYYYY(date)
            : new Date(date);

    if (isNaN(selectedDate.getTime())) return false;

    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pastLimit = new Date(today);
    pastLimit.setDate(today.getDate() - days);

    const futureLimit = new Date(today);
    futureLimit.setDate(today.getDate() + days);

    return selectedDate >= pastLimit && selectedDate <= futureLimit;
};
