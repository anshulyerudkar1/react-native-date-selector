// /// <reference path="./react-native-classname.d.ts" />

// /**
//  * DateSelector is a small “select / type” UI component that lets users pick
//  * day, month, and year (with dropdown suggestions), and optionally calculates age.
//  *
//  * This file also exports little date helper functions (format/parse/age) used by
//  * the component and exposed for consumers to reuse.
//  */

// import React, { useEffect, useMemo, useState } from 'react';
// import {
//   View as RNView,
//   Text as RNText,
//   TextInput as RNTextInput,
//   TouchableOpacity as RNTouchableOpacity,
//   useColorScheme,
// } from 'react-native';
// import { translation } from './languages/utils';
// import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';

// // Helper type to allow `className` on native components (used with Tailwind-style classes).
// type WithClassName<P> = P & {
//   className?: string;
// };

// const View = (props: WithClassName<React.ComponentProps<typeof RNView>>) => (
//   <RNView {...props} />
// );
// const Text = (props: WithClassName<React.ComponentProps<typeof RNText>>) => (
//   <RNText {...props} />
// );
// const TextInput = (props: WithClassName<React.ComponentProps<typeof RNTextInput>>) => (
//   <RNTextInput {...props} />
// );
// const TouchableOpacity = (
//   props: WithClassName<React.ComponentProps<typeof RNTouchableOpacity>>
// ) => <RNTouchableOpacity {...props} />;
// const ScrollView = (
//   props: WithClassName<React.ComponentProps<typeof GestureScrollView>>
// ) => <GestureScrollView {...props} />;

// // Static month list used to display and parse month values in the UI.
// const months = [
//     { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
//     { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
//     { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
//     { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 },
// ];

// import { calculateAge, formatDate, parseDateString, pad } from './dateUtils';

// // Helper: days in a month (1-based month number) — used to validate day input values.
// const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

// export type Props = {
//     label: string;
//     lang: 'English' | 'Marathi' | 'Hindi';
//     showAge?: boolean;
//     baseDate?: string | null;
//     returnFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';
//     allowNullStart?: boolean;
//     onDateChange: (formattedDate: Date | string, age: number | null) => void;
//     IsYearEdit?: boolean;
//     IsMonthEdit?: boolean;
//     IsDayEdit?: boolean;
//     resetIfNullState?: boolean;
//     allowFutureYear?: boolean;
// };

// const DateSelector: React.FC<Props> = ({
//     label,
//     lang,
//     showAge = false,
//     baseDate,
//     returnFormat = 'DD/MM/YYYY',
//     allowNullStart = false,
//     onDateChange,
//     IsYearEdit = true,
//     IsMonthEdit = true,
//     IsDayEdit = true,
//     resetIfNullState = false,
//     allowFutureYear = false,
// }) => {
//     const isDark = useColorScheme() === 'dark';

//     const initialDate = useMemo(() => parseDateString(baseDate), [baseDate]);

//     const [year, setYear] = useState<number | null>(
//         allowNullStart ? null : initialDate.getFullYear()
//     );
//     const [yearInput, setYearInput] = useState(
//         allowNullStart ? '' : initialDate.getFullYear().toString()
//     );

//     const [month, setMonth] = useState<number | null>(
//         allowNullStart ? null : initialDate.getMonth() + 1
//     );
//     const [monthInput, setMonthInput] = useState(
//         allowNullStart ? '' : months[initialDate.getMonth()]?.name ?? ''
//     );

//     const [day, setDay] = useState<number | null>(
//         allowNullStart ? null : initialDate.getDate()
//     );
//     const [dayInput, setDayInput] = useState(
//         allowNullStart ? '' : pad(initialDate.getDate())
//     );

//     const [age, setAge] = useState<number | null>(null);
//     const [showYearList, setShowYearList] = useState(false);
//     const [showMonthList, setShowMonthList] = useState(false);
//     const [showDayList, setShowDayList] = useState(false);

//     const yearList = useMemo(
//         () => Array.from({ length: initialDate.getFullYear() - 1900 + 1 }, (_, i) => 1000 + i).reverse(),
//         [initialDate.getFullYear()]
//     );

//     const daysInMonth = useMemo(
//         () => getDaysInMonth(month ?? 1, year ?? new Date().getFullYear()),
//         [month, year]
//     );

//     const baseDateObj = useMemo(() => parseDateString(baseDate), [baseDate]);

//     useEffect(() => {
//         if (allowNullStart) return;

//         if (baseDate) {
//             const y = initialDate.getFullYear();
//             const m = initialDate.getMonth() + 1;
//             const d = initialDate.getDate();

//             setYear(y);
//             setYearInput(y.toString());
//             setMonth(m);
//             setMonthInput(months[m - 1]?.name ?? '');
//             setDay(d);
//             setDayInput(pad(d));
//         }
//     }, [baseDate, initialDate]);

    

//     useEffect(() => {
//         const today = new Date();

//         const effectiveYear = year ?? today.getFullYear();
//         const effectiveMonth = month ?? today.getMonth() + 1;
//         const effectiveDay = day ?? today.getDate();

//         const birthDate = new Date(effectiveYear, effectiveMonth - 1, effectiveDay);
//         const calculatedAge = calculateAge(birthDate, baseDateObj);

//         setMonth(effectiveMonth);
//         setDay(effectiveDay);

//         setAge(showAge ? calculatedAge : null);

//         if (year && month && day) {
//             const formatted = formatDate(day, month, year, returnFormat);
//             onDateChange(formatted, showAge ? calculatedAge : null);
//         }
//     }, [year, month, day]);

    

//     useEffect(() => {
//         if (!resetIfNullState) {
//             const yy = initialDate.getFullYear();
//             const mm = initialDate.getMonth() + 1;
//             const dd = initialDate.getDate();
//             const safeMonthName =
//                 month && month >= 1 && month <= 12
//                     ? months[month - 1]?.name ?? ''
//                     : months[mm - 1]?.name ?? '';

//             setYearInput(year !== null && year !== undefined ? year.toString() : yy.toString());
//             setMonthInput(safeMonthName);
//             setDayInput(day !== null && day !== undefined ? pad(day) : pad(dd));

//             return;
//         }

//         setYearInput('');
//         setMonthInput('');
//         setDayInput('');
//         setShowYearList(false);
//         setShowMonthList(false);
//         setShowDayList(false);
//     }, [year, month, day, resetIfNullState]);


//     // Translation helper (code → localized string)
//     const t = (code: number) => translation[code]?.[lang] || '';

//     const filteredYearList = useMemo(() => {
//         if (!yearInput) return yearList;
//         return yearList.filter((y) => y.toString().startsWith(yearInput));
//     }, [yearInput, yearList]);

//     const filteredMonthList = useMemo(() => {
//         if (!monthInput) return months;
//         return months.filter((m) =>
//             m.name.toLowerCase().startsWith(monthInput.toLowerCase()) ||
//             m.value.toString().startsWith(monthInput)
//         );
//     }, [monthInput]);

//     const filteredDayList = useMemo(() => {
//         if (!dayInput) return Array.from({ length: daysInMonth }, (_, i) => i + 1);
//         return Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((d) =>
//             d.toString().startsWith(dayInput)
//         );
//     }, [dayInput, daysInMonth]);


//     return (
//         <View className="flex-row justify-between w-full mb-2">
//             {/* Left Column */}
//             <View className="w-3/4 pr-2">
//                 <Text className="text-base text-black my-[5px] ">{label}:</Text>

//                 <View className="justify-center">
//                     <View className="flex-row justify-between mb-1">
//                         <Text className="text-xs text-black font-medium w-1/3 text-center">{t(510)}</Text>
//                         <Text className="text-xs text-black font-medium w-1/3 text-center">{t(511)}</Text>
//                         <Text className="text-xs text-black font-medium w-1/3 text-center">{t(512)}</Text>
//                     </View>
//                     <View className="flex-row space-x-2">

//                         {/* Year */}
//                         <View className="w-1/3 relative">
//                             <TextInput
//                                 testID="date-selector-year"
//                                 className={
//                                     `border border-gray-300 rounded px-2 py-1 text-center text-base text-black 
//                                     ${IsYearEdit ? '' : 'bg-gray-300'}`
//                                 }
//                                 keyboardType="numeric"
//                                 maxLength={4}
//                                 value={yearInput}
//                                 onFocus={() => setShowYearList(true)}
//                                 onChangeText={(text) => {
//                                     const clean = text.replace(/[^0-9]/g, '');
//                                     setYearInput(clean);

                                    
//                                     if (clean.length === 4) {
//                                         const parsed = parseInt(clean, 10);
//                                         const currentYear = new Date().getFullYear();

//                                         const isValid =
//                                             parsed >= 1900 &&
//                                             (allowFutureYear ? true : parsed <= currentYear);

//                                         if (isValid) {
//                                             setYear(parsed);
//                                             setShowYearList(false);
//                                         } else {
//                                             // invalid year → clear
//                                             setYear(null);
//                                             setYearInput('');
//                                             setMonthInput('');
//                                             setDayInput('');
//                                         }
//                                     }
//                                 }}
//                                 editable={IsYearEdit}
//                             />
//                             {showYearList && (
//                                 <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
//                                     {filteredYearList.map((item) => (
//                                         <TouchableOpacity
//                                             key={item}
//                                             onPress={() => {
//                                                 if (!IsYearEdit) return;
//                                                 setYear(item);
//                                                 setYearInput(item.toString());
//                                                 setShowYearList(false);
//                                             }}
//                                         >
//                                             <Text className="p-1 text-center text-base text-black">{item}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             )}
//                         </View>

//                         {/* Month */}
//                         <View className="w-1/3 relative">
//                             <TextInput
//                                 testID="date-selector-month"
//                                 className={`border border-gray-300 rounded px-2 py-1 text-center text-base text-black ${IsMonthEdit ? '' : 'bg-gray-300'}`}
//                                 maxLength={3}
//                                 value={monthInput}
//                                 onFocus={() => setShowMonthList(true)}
//                                 onChangeText={(text) => {
//                                     setMonthInput(text);
//                                     setShowMonthList(true);

//                                     const trimmed = text.trim();

//                                     if (/^(0[1-9]|1[0-2])$/.test(trimmed)) {
//                                         const n = parseInt(trimmed, 10);
//                                         const m = months[n - 1];
//                                         setMonth(n);
//                                         setMonthInput(m?.name ?? '');
//                                         setShowMonthList(false);
//                                         return;
//                                     }

//                                     if (/^[1-9]$/.test(trimmed)) {
//                                         return;
//                                     }

//                                     if (trimmed.length >= 3) {
//                                         const m = months.find((mo) =>
//                                             mo.name.toLowerCase().startsWith(trimmed.toLowerCase())
//                                         );
//                                         if (m) {
//                                             setMonth(m.value);
//                                             setMonthInput(m.name);
//                                             setShowMonthList(false);
//                                         }
//                                     }
//                                 }}
//                                 editable={IsMonthEdit}
//                             />
//                             {showMonthList && (
//                                 <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
//                                     {filteredMonthList.map((item) => (
//                                         <TouchableOpacity
//                                             key={item.value}
//                                             onPress={() => {
//                                                 if (!IsMonthEdit) return;
//                                                 setMonth(item.value);
//                                                 setMonthInput(item.name);
//                                                 setShowMonthList(false);
//                                             }}
//                                         >
//                                             <Text className="p-1 text-center text-base text-black">{item.name}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             )}
//                         </View>

//                         {/* Day */}
//                         <View className="w-1/3 relative">
//                             <TextInput
//                                 testID="date-selector-day"
//                                 className={`border border-gray-300 rounded px-2 py-1 text-center text-base text-black ${IsDayEdit ? '' : 'bg-gray-300'}`}
//                                 keyboardType="numeric"
//                                 maxLength={2}
//                                 value={dayInput}
//                                 onFocus={() => setShowDayList(true)}
//                                 onChangeText={(text) => setDayInput(text.replace(/[^0-9]/g, ''))}
//                                 onBlur={() => {
//                                     if (!dayInput) return;

//                                     const num = parseInt(dayInput, 10);

//                                     if (num >= 1 && num <= daysInMonth) {
//                                         setDay(num);
//                                         setDayInput(pad(num));
//                                         setShowDayList(false);
//                                     } else {
//                                         // invalid → clear
//                                         setDay(null);
//                                         setDayInput('');
//                                         setShowDayList(false);
//                                     }
//                                 }}
//                                 editable={IsDayEdit}
//                             />
//                             {showDayList && (
//                                 <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
//                                     {filteredDayList.map((item) => (
//                                         <TouchableOpacity
//                                             key={item}
//                                             onPress={() => {
//                                                 if (!IsDayEdit) return;
//                                                 setDay(item);
//                                                 setDayInput(pad(item));
//                                                 setShowDayList(false);
//                                             }}
//                                         >
//                                             <Text className="p-1 text-center text-base text-black">{pad(item)}</Text>
//                                         </TouchableOpacity>
//                                     ))}
//                                 </ScrollView>
//                             )}
//                         </View>

//                     </View>
//                 </View>
//             </View>

//             {/* Right Column: Age */}
//             {showAge && (
//                 <View className="w-1/4 pl-4">
//                     <Text className="text-base text-black my-[5px]">  </Text>
//                     <View className="justify-center">
//                         <View className="flex-row justify-between mb-1">
//                             <Text className="text-xs text-black font-medium w-full text-center">{t(29)}</Text>
//                         </View>
//                         <View className="flex-row space-x-2">
//                             <View className="flex-1 relative">
//                                     <TextInput
//                                         className={`border border-gray-300 text-black rounded px-2 py-1 text-center text-base ${isDark ? 'text-black bg-gray-300' : 'bg-gray-300 text-black'}`}
//                                         editable={false}
//                                         value={age?.toString() || ''}
//                                     />
//                             </View>
//                         </View>
//                     </View>
//                 </View>
//             )}
//         </View>
//     );
// };

// export { DateSelector, calculateAge, formatDate, parseDateString };
// export default DateSelector;


import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  ScrollView,
} from 'react-native';

// import { ScrollView } from 'react-native-gesture-handler';
import { translation } from './languages/utils';
import { calculateAge, formatDate, parseDateString } from './dateUtils';

const months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 },
];

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
const getDaysInMonth = (month: number, year: number) => new Date(year, month, 0).getDate();

export type Props = {
  label: string;
  lang: 'English' | 'Marathi' | 'Hindi';
  showAge?: boolean;
  baseDate?: string | null;
  returnFormat?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';
  allowNullStart?: boolean;
  onDateChange: (formattedDate: Date | string, age: number | null) => void;
  IsYearEdit?: boolean;
  IsMonthEdit?: boolean;
  IsDayEdit?: boolean;
  resetIfNullState?: boolean;
  allowFutureYear?: boolean;
};

const DateSelector: React.FC<Props> = ({
  label,
  lang,
  showAge = false,
  baseDate,
  returnFormat = 'DD/MM/YYYY',
  allowNullStart = false,
  onDateChange,
  IsYearEdit = true,
  IsMonthEdit = true,
  IsDayEdit = true,
  resetIfNullState = false,
  allowFutureYear = false,
}) => {
  
  const isDark = useColorScheme() === 'dark';
    
    const initialDate = useMemo(() => {
        if (!baseDate) return new Date();

        // Convert to string and normalize separators
        let safe = baseDate.toString().trim().replace(/\//g, "-");

        // ✅ Detect and fix DD-MM-YYYY → convert to YYYY-MM-DD
        if (/^\d{2}-\d{2}-\d{4}$/.test(safe)) {
            const [dd, mm, yyyy] = safe.split("-");
            safe = `${yyyy}-${mm}-${dd}`;
        }

        const parsed = new Date(safe);
        return isNaN(parsed.getTime()) ? new Date() : parsed;
    }, [baseDate]);

    
    // ✅ Allow null initialization if prop is true
    const [year, setYear] = useState<number | null>(
        allowNullStart ? null : initialDate.getFullYear()
    );
    const [yearInput, setYearInput] = useState(
        allowNullStart ? '' : initialDate.getFullYear().toString()
    );

    const [month, setMonth] = useState<number | null>(
        allowNullStart ? null : initialDate.getMonth() + 1
    );
    const [monthInput, setMonthInput] = useState(
        allowNullStart ? '' : months[initialDate.getMonth()]?.name || ''
    );

    const [day, setDay] = useState<number | null>(
        allowNullStart ? null : initialDate.getDate()
    );
    const [dayInput, setDayInput] = useState(
        allowNullStart ? '' : pad(initialDate.getDate())
    );

    const [age, setAge] = useState<number | null>(null);
    const [showYearList, setShowYearList] = useState(false);
    const [showMonthList, setShowMonthList] = useState(false);
    const [showDayList, setShowDayList] = useState(false);

    const yearList = useMemo(
        () => Array.from({ length: initialDate.getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).reverse(),
        [initialDate.getFullYear()]
    );

    const daysInMonth = useMemo(() => getDaysInMonth(month ?? 1, year ?? new Date().getFullYear()), [month, year]);

    const baseDateObj = useMemo(() => {
        const parsed = baseDate ? new Date(baseDate) : null;
        return parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
    }, [baseDate]);

    // ✅ ADD THIS useEffect (right here)
    useEffect(() => {
        if (allowNullStart) return; 

        if (baseDate) {
            const y = initialDate.getFullYear();
            const m = initialDate.getMonth() + 1;
            const d = initialDate.getDate();

            setYear(y);
            setYearInput(y.toString());
            setMonth(m);
            setMonthInput(months[(m - 1)]?.name || '');
            setDay(d);
            setDayInput(pad(d));
        }
    }, [baseDate, initialDate]);


    useEffect(() => {
        
        const today = new Date();

        const effectiveYear = year ?? today.getFullYear();
        const effectiveMonth = month ?? today.getMonth() + 1; 
        const effectiveDay = day ?? today.getDate();           

        const birthDate = new Date(effectiveYear, effectiveMonth - 1, effectiveDay);
        const calculatedAge = calculateAge(birthDate, baseDateObj);

        setMonth(effectiveMonth);
        setDay(effectiveDay);

        setAge(showAge ? calculatedAge : null);

        // Only send formatted DOB when full date is selected
        if (year && month && day) {
            const formatted = formatDate(day, month, year, returnFormat);
            onDateChange(formatted, showAge ? calculatedAge : null);
        }
    }, [year, month, day]);

    

    useEffect(() => {
        
        if (!resetIfNullState) 
        {
            const yy = initialDate.getFullYear();
            const mm =initialDate.getMonth() + 1;
            const dd = initialDate.getDate();
            setYearInput(year !== null && year !== undefined ? year.toString() : yy.toString());
            setMonthInput(
              month !== null && month !== undefined
                ? months[month - 1]?.name || ''
                : months[mm - 1]?.name || ''
            );
            setDayInput(day !== null && day !== undefined ? pad(day) : pad(dd));
            
            return;
        }
        else {
            setYearInput('');
            setMonthInput('');
            setDayInput('');
            setShowYearList(false);
            setShowMonthList(false);
            setShowDayList(false);
        }
        
    }, [year, month, day, resetIfNullState]);


    const t = (code: number) => translation[code]?.[lang] || '';

    const filteredYearList = useMemo(() => {
        if (!yearInput) return yearList;
        return yearList.filter((y) => y.toString().startsWith(yearInput));
    }, [yearInput, yearList]);

    const filteredMonthList = useMemo(() => {
        if (!monthInput) return months;
        return months.filter((m) =>
            m.name.toLowerCase().startsWith(monthInput.toLowerCase()) ||
            m.value.toString().startsWith(monthInput)
        );
    }, [monthInput]);

    const filteredDayList = useMemo(() => {
        if (!dayInput) return Array.from({ length: daysInMonth }, (_, i) => i + 1);
        return Array.from({ length: daysInMonth }, (_, i) => i + 1).filter((d) =>
            d.toString().startsWith(dayInput)
        );
    }, [dayInput, daysInMonth]);

  return (
    <View style={styles.containerRow}>
      <View style={styles.leftColumn}>
        <Text style={styles.label}>{label}:</Text>

        <View>
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>{t(510)}</Text>
            <Text style={styles.headerText}>{t(511)}</Text>
            <Text style={styles.headerText}>{t(512)}</Text>
          </View>

          <View style={styles.inputRow}>
            {/* YEAR */}
            <View style={styles.inputContainer}>
              <TextInput
                testID="date-selector-year"
                style={[styles.input, !IsYearEdit && styles.disabledInput]}
                keyboardType="numeric"
                maxLength={4}
                value={yearInput}
                editable={IsYearEdit}
                onFocus={() => setShowYearList(true)}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, '');
                  setYearInput(clean);

                  if (clean.length === 4) {
                    const parsed = parseInt(clean);
                    const currentYear = new Date().getFullYear();

                    const isValid =
                      parsed >= 1900 &&
                      (allowFutureYear ? true : parsed <= currentYear);

                    if (isValid) {
                      setYear(parsed);
                      setShowYearList(false);
                    } else {
                      setYear(null);
                      setYearInput('');
                    }
                  }
                }}
              />

              {showYearList && (
                <ScrollView style={styles.dropdown}>
                  {filteredYearList.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setYear(item);
                        setYearInput(item.toString());
                        setShowYearList(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* MONTH */}
            <View style={styles.inputContainer}>
              <TextInput
                testID="date-selector-month"
                style={[styles.input, !IsMonthEdit && styles.disabledInput]}
                maxLength={3}
                value={monthInput}
                editable={IsMonthEdit}
                onFocus={() => setShowMonthList(true)}
                onChangeText={(text) => setMonthInput(text)}
              />

              {showMonthList && (
                <ScrollView style={styles.dropdown}>
                  {filteredMonthList.map((item) => (
                    <TouchableOpacity
                      key={item.value}
                      onPress={() => {
                        setMonth(item.value);
                        setMonthInput(item.name);
                        setShowMonthList(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* DAY */}
            <View style={styles.inputContainer}>
              <TextInput
                testID="date-selector-day"
                style={[styles.input, !IsDayEdit && styles.disabledInput]}
                keyboardType="numeric"
                maxLength={2}
                value={dayInput}
                editable={IsDayEdit}
                onFocus={() => setShowDayList(true)}
                onChangeText={(text) =>
                  setDayInput(text.replace(/[^0-9]/g, ''))
                }
                onBlur={() => {
                    const parsed = parseInt(dayInput);
                    const maxDay = getDaysInMonth(month ?? 1, year ?? new Date().getFullYear());

                    if (!parsed || parsed < 1 || parsed > maxDay) {
                        // revert to last valid value or default
                        const fallback = day ?? 5;
                        setDayInput(pad(fallback));
                        setDay(fallback);
                        setShowDayList(false);
                        return;
                    }

                    setDay(parsed);
                    setDayInput(pad(parsed));
                    setShowDayList(false);
                    }}
              />

              {showDayList && (
                <ScrollView style={styles.dropdown}>
                  {filteredDayList.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setDay(item);
                        setDayInput(pad(item));
                        setShowDayList(false);
                      }}
                    >
                      <Text style={styles.dropdownItem}>{pad(item)}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>
        </View>
      </View>

      {showAge && (
        <View style={styles.rightColumn}>
          <Text style={styles.label}></Text>

          <View>
            <Text style={styles.ageLabel}>{t(29)}</Text>

            <TextInput
              style={[
                styles.ageInput,
                isDark && { backgroundColor: '#9ca3af' },
              ]}
              editable={false}
              value={age?.toString() || ''}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export { DateSelector, calculateAge, formatDate, parseDateString };

export default DateSelector;

const styles = StyleSheet.create({
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
  },

  leftColumn: {
    width: '75%',
    paddingRight: 8,
  },

  rightColumn: {
    width: '25%',
    paddingLeft: 16,
  },

  label: {
    fontSize: 16,
    color: 'black',
    marginVertical: 5,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  headerText: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    width: '33%',
    textAlign: 'center',
  },

  inputRow: {
    flexDirection: 'row',
  },

  inputContainer: {
    width: '33%',
    position: 'relative',
    marginRight: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },

  disabledInput: {
    backgroundColor: '#d1d5db',
  },

  dropdown: {
    position: 'absolute',
    top: 40,
    maxHeight: 128,
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    backgroundColor: 'white',
    zIndex: 10,
  },

  dropdownItem: {
    padding: 6,
    textAlign: 'center',
    fontSize: 16,
    color: 'black',
  },

  ageLabel: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },

  ageInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    fontSize: 16,
    backgroundColor: '#d1d5db',
    color: 'black',
  },
});
