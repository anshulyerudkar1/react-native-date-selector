/// <reference path="./react-native-classname.d.ts" />

/**
 * DateSelector is a small “select / type” UI component that lets users pick
 * day, month, and year (with dropdown suggestions), and optionally calculates age.
 *
 * This file also exports little date helper functions (format/parse/age) used by
 * the component and exposed for consumers to reuse.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  View as RNView,
  Text as RNText,
  TextInput as RNTextInput,
  TouchableOpacity as RNTouchableOpacity,
  useColorScheme,
} from 'react-native';
import { translation } from './languages/utils';
import { ScrollView as GestureScrollView } from 'react-native-gesture-handler';

// Helper type to allow `className` on native components (used with Tailwind-style classes).
type WithClassName<P> = P & {
  className?: string;
};

const View = (props: WithClassName<React.ComponentProps<typeof RNView>>) => (
  <RNView {...props} />
);
const Text = (props: WithClassName<React.ComponentProps<typeof RNText>>) => (
  <RNText {...props} />
);
const TextInput = (props: WithClassName<React.ComponentProps<typeof RNTextInput>>) => (
  <RNTextInput {...props} />
);
const TouchableOpacity = (
  props: WithClassName<React.ComponentProps<typeof RNTouchableOpacity>>
) => <RNTouchableOpacity {...props} />;
const ScrollView = (
  props: WithClassName<React.ComponentProps<typeof GestureScrollView>>
) => <GestureScrollView {...props} />;

// Static month list used to display and parse month values in the UI.
const months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 },
];

import { calculateAge, formatDate, parseDateString, pad } from './dateUtils';

// Helper: days in a month (1-based month number) — used to validate day input values.
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

    const initialDate = useMemo(() => parseDateString(baseDate), [baseDate]);

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
        allowNullStart ? '' : months[initialDate.getMonth()]?.name ?? ''
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
        () => Array.from({ length: initialDate.getFullYear() - 1900 + 1 }, (_, i) => 1000 + i).reverse(),
        [initialDate.getFullYear()]
    );

    const daysInMonth = useMemo(
        () => getDaysInMonth(month ?? 1, year ?? new Date().getFullYear()),
        [month, year]
    );

    const baseDateObj = useMemo(() => parseDateString(baseDate), [baseDate]);

    useEffect(() => {
        if (allowNullStart) return;

        if (baseDate) {
            const y = initialDate.getFullYear();
            const m = initialDate.getMonth() + 1;
            const d = initialDate.getDate();

            setYear(y);
            setYearInput(y.toString());
            setMonth(m);
            setMonthInput(months[m - 1]?.name ?? '');
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

        if (year && month && day) {
            const formatted = formatDate(day, month, year, returnFormat);
            onDateChange(formatted, showAge ? calculatedAge : null);
        }
    }, [year, month, day]);

    

    useEffect(() => {
        if (!resetIfNullState) {
            const yy = initialDate.getFullYear();
            const mm = initialDate.getMonth() + 1;
            const dd = initialDate.getDate();
            const safeMonthName =
                month && month >= 1 && month <= 12
                    ? months[month - 1]?.name ?? ''
                    : months[mm - 1]?.name ?? '';

            setYearInput(year !== null && year !== undefined ? year.toString() : yy.toString());
            setMonthInput(safeMonthName);
            setDayInput(day !== null && day !== undefined ? pad(day) : pad(dd));

            return;
        }

        setYearInput('');
        setMonthInput('');
        setDayInput('');
        setShowYearList(false);
        setShowMonthList(false);
        setShowDayList(false);
    }, [year, month, day, resetIfNullState]);


    // Translation helper (code → localized string)
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
        <View className="flex-row justify-between w-full mb-2">
            {/* Left Column */}
            <View className="w-3/4 pr-2">
                <Text className="text-base text-black my-[5px] ">{label}:</Text>

                <View className="justify-center">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-black font-medium w-1/3 text-center">{t(510)}</Text>
                        <Text className="text-xs text-black font-medium w-1/3 text-center">{t(511)}</Text>
                        <Text className="text-xs text-black font-medium w-1/3 text-center">{t(512)}</Text>
                    </View>
                    <View className="flex-row space-x-2">

                        {/* Year */}
                        <View className="w-1/3 relative">
                            <TextInput
                                testID="date-selector-year"
                                className={
                                    `border border-gray-300 rounded px-2 py-1 text-center text-base text-black 
                                    ${IsYearEdit ? '' : 'bg-gray-300'}`
                                }
                                keyboardType="numeric"
                                maxLength={4}
                                value={yearInput}
                                onFocus={() => setShowYearList(true)}
                                onChangeText={(text) => {
                                    const clean = text.replace(/[^0-9]/g, '');
                                    setYearInput(clean);

                                    
                                    if (clean.length === 4) {
                                        const parsed = parseInt(clean, 10);
                                        const currentYear = new Date().getFullYear();

                                        const isValid =
                                            parsed >= 1900 &&
                                            (allowFutureYear ? true : parsed <= currentYear);

                                        if (isValid) {
                                            setYear(parsed);
                                            setShowYearList(false);
                                        } else {
                                            // invalid year → clear
                                            setYear(null);
                                            setYearInput('');
                                            setMonthInput('');
                                            setDayInput('');
                                        }
                                    }
                                }}
                                editable={IsYearEdit}
                            />
                            {showYearList && (
                                <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
                                    {filteredYearList.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                if (!IsYearEdit) return;
                                                setYear(item);
                                                setYearInput(item.toString());
                                                setShowYearList(false);
                                            }}
                                        >
                                            <Text className="p-1 text-center text-base text-black">{item}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* Month */}
                        <View className="w-1/3 relative">
                            <TextInput
                                testID="date-selector-month"
                                className={`border border-gray-300 rounded px-2 py-1 text-center text-base text-black ${IsMonthEdit ? '' : 'bg-gray-300'}`}
                                maxLength={3}
                                value={monthInput}
                                onFocus={() => setShowMonthList(true)}
                                onChangeText={(text) => {
                                    setMonthInput(text);
                                    setShowMonthList(true);

                                    const trimmed = text.trim();

                                    if (/^(0[1-9]|1[0-2])$/.test(trimmed)) {
                                        const n = parseInt(trimmed, 10);
                                        const m = months[n - 1];
                                        setMonth(n);
                                        setMonthInput(m?.name ?? '');
                                        setShowMonthList(false);
                                        return;
                                    }

                                    if (/^[1-9]$/.test(trimmed)) {
                                        return;
                                    }

                                    if (trimmed.length >= 3) {
                                        const m = months.find((mo) =>
                                            mo.name.toLowerCase().startsWith(trimmed.toLowerCase())
                                        );
                                        if (m) {
                                            setMonth(m.value);
                                            setMonthInput(m.name);
                                            setShowMonthList(false);
                                        }
                                    }
                                }}
                                editable={IsMonthEdit}
                            />
                            {showMonthList && (
                                <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
                                    {filteredMonthList.map((item) => (
                                        <TouchableOpacity
                                            key={item.value}
                                            onPress={() => {
                                                if (!IsMonthEdit) return;
                                                setMonth(item.value);
                                                setMonthInput(item.name);
                                                setShowMonthList(false);
                                            }}
                                        >
                                            <Text className="p-1 text-center text-base text-black">{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                        {/* Day */}
                        <View className="w-1/3 relative">
                            <TextInput
                                testID="date-selector-day"
                                className={`border border-gray-300 rounded px-2 py-1 text-center text-base text-black ${IsDayEdit ? '' : 'bg-gray-300'}`}
                                keyboardType="numeric"
                                maxLength={2}
                                value={dayInput}
                                onFocus={() => setShowDayList(true)}
                                onChangeText={(text) => setDayInput(text.replace(/[^0-9]/g, ''))}
                                onBlur={() => {
                                    if (!dayInput) return;

                                    const num = parseInt(dayInput, 10);

                                    if (num >= 1 && num <= daysInMonth) {
                                        setDay(num);
                                        setDayInput(pad(num));
                                        setShowDayList(false);
                                    } else {
                                        // invalid → clear
                                        setDay(null);
                                        setDayInput('');
                                        setShowDayList(false);
                                    }
                                }}
                                editable={IsDayEdit}
                            />
                            {showDayList && (
                                <ScrollView className="absolute z-10 top-10 max-h-32 w-full border rounded bg-white">
                                    {filteredDayList.map((item) => (
                                        <TouchableOpacity
                                            key={item}
                                            onPress={() => {
                                                if (!IsDayEdit) return;
                                                setDay(item);
                                                setDayInput(pad(item));
                                                setShowDayList(false);
                                            }}
                                        >
                                            <Text className="p-1 text-center text-base text-black">{pad(item)}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )}
                        </View>

                    </View>
                </View>
            </View>

            {/* Right Column: Age */}
            {showAge && (
                <View className="w-1/4 pl-4">
                    <Text className="text-base text-black my-[5px]">  </Text>
                    <View className="justify-center">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-xs text-black font-medium w-full text-center">{t(29)}</Text>
                        </View>
                        <View className="flex-row space-x-2">
                            <View className="flex-1 relative">
                                    <TextInput
                                        className={`border border-gray-300 text-black rounded px-2 py-1 text-center text-base ${isDark ? 'text-black bg-gray-300' : 'bg-gray-300 text-black'}`}
                                        editable={false}
                                        value={age?.toString() || ''}
                                    />
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

export { DateSelector, calculateAge, formatDate, parseDateString };
export default DateSelector;

