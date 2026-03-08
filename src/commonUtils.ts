//export const Base_URL = 'https://venkateshwarasmartdeviceapi-fahah9cggrh0h5bk.centralus-01.azurewebsites.net/api/'; //prod
export const Base_URL = 'https://venkateshwarasmartdeviceuatapi-fbahe0ekdddgfted.centralus-01.azurewebsites.net/api/'; //uat
//export const Base_URL = 'http://192.168.1.39:81/api/'; //local Office
//export const Base_URL = 'http://192.168.1.39:90/api/'; //local SD
//export const Base_URL = 'http://192.168.1.34:89/api/'; //local SW
//export const Base_URL = 'http://10.70.139.135:81/api/'; //local

export const SaatBaraMandatory=false;

//export const AadhaarBaseURL = 'http://venkateshwara-ocr.dncqb3hmdehxdqg3.westindia.azurecontainer.io:8000/';
export const AadhaarBaseURL = 'http://venkateshwara-ocr.westindia.azurecontainer.io:8000/';

export var urlVersion = 'PROD';

export const cleanPartial = (val: unknown): string => {
  if (val === undefined || val === null) return "";

  let clean = String(val).trim();
  if (!clean) return "";

  // Remove "partially_visible" (any format)
  
  clean = clean.replace(/partially_visible\s*:?/gi, "").trim();

  // Remove any brackets []
  clean = clean.replace(/[\[\]]/g, "").trim();

  // Extract year from "Year of birth - 1965"
  const yobMatch = clean.match(/year\s*of\s*birth\s*-\s*(\d{4})/i);
  if (yobMatch) {
    return yobMatch[1] ?? ""; // return ONLY year
  }

  // Remove "Year of birth - " if leftover
  clean = clean.replace(/year\s*of\s*birth\s*-\s*/i, "").trim();

  return clean || "";
};

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

export const getPayphiFormattedDate = () => {
  const now = new Date();

  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const HH = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `${yyyy}${MM}${dd}${HH}${mm}${ss}`;
};

export const yyyyMMddHHmmssConvertDateddMMyyyy = (value: string): string => {
  if (!value || value.length < 8) return "";

  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);

  return `${day}/${month}/${year}`;
};


export const generateMerchantTxnNo = (tempMemberID: string): string => {
    const now = new Date();

    const yy = now.getFullYear().toString(); // 25
    const MM = String(now.getMonth() + 1).padStart(2, '0'); // 01–12
    const dd = String(now.getDate()).padStart(2, '0'); // 01–31
    const HH = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');

    return `${tempMemberID}${dd}${MM}${yy}${HH}${mm}${ss}`;
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

// export const isDateWithinDays = (date, days, options = {}) => {
//   console.log("isDateWithinDays called with date:", date, "days:", days, "options:", options);
//     if (!date || !days) return false;

//     const selectedDate = new Date(date);
//     selectedDate.setHours(0, 0, 0, 0);

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const pastLimit = new Date(today);
//     pastLimit.setDate(today.getDate() - days);

//     if (options.allowFuture) {
//         const futureLimit = new Date(today);
//         futureLimit.setDate(today.getDate() + days);
//         return selectedDate >= pastLimit && selectedDate <= futureLimit;
//     }

//     return selectedDate >= pastLimit && selectedDate <= today;
// };

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

export const getAppSettingValue = (settings: Array<{ KeyName: string; KeyValue: any }> | null | undefined, key: string, defaultValue: any = null): any => {
    const setting = settings?.find(item => item.KeyName === key);
    return setting ? setting.KeyValue : defaultValue;
};

// export const cleanValue = (value) => {
//   if (value === null || value === undefined) return '';

//   const stringValue = String(value).trim().toLowerCase();

//   if (
//     stringValue === 'null' ||
//     stringValue === ':null' ||
//     stringValue === 'null,' ||
//     stringValue === ',null' ||
//     stringValue.includes(':null')
//   ) {
//     return '';
//   }

//   return String(value).trim();
// };

export const cleanValue = (value: unknown): string => {
  if (value === null || value === undefined) return "";

  let clean = String(value).trim();

  if (!clean) return "";

  // Remove null in any format (null, NULL, Null, :null, ,null, etc)
  clean = clean.replace(/[:;,]*\s*null\s*[:;,]*/gi, "");

  // Remove only symbols if remaining (: , ;)
  clean = clean.replace(/^[:;,]+|[:;,]+$/g, "");

  // Remove multiple commas, semicolons, colons
  clean = clean.replace(/[:;,]{2,}/g, "");

  // Final trim
  clean = clean.trim();

  return clean || "";
};