import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  ScrollView,
  Animated,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { defaultTranslations } from './utils/translations';
import { lightTheme, darkTheme } from './theme/defaultTheme';
import { calculateAge, formatDate, parseDateString, pad, getDaysInMonth } from './utils/date';
import type { DateSelectorProps, DateSelectorTheme } from './types';

const months = [
  { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
  { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
  { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
  { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 },
];

const DropdownCaret = ({ color }: { color: string }) => (
  <View
    style={{
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderBottomWidth: 0,
      borderTopWidth: 5,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderTopColor: color,
      opacity: 0.6,
    }}
  />
);

interface AnimatedDropdownProps {
  visible: boolean;
  theme: Required<DateSelectorTheme>;
  maxHeight?: number;
  dropdownStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

const AnimatedDropdown: React.FC<AnimatedDropdownProps> = ({ visible, theme, maxHeight = 160, dropdownStyle, children }) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: visible ? 1 : 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  const animatedStyle = {
    opacity: animatedValue,
    transform: [
      {
        translateY: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [-6, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.dropdown,
        {
          backgroundColor: theme.dropdownBackgroundColor,
          borderColor: theme.dropdownBorderColor,
          borderRadius: theme.borderRadius,
          maxHeight,
          elevation: theme.elevation,
          shadowOpacity: theme.shadowOpacity,
          shadowRadius: theme.borderRadius / 2,
        },
        dropdownStyle,
        animatedStyle,
      ]}
    >
      <ScrollView keyboardShouldPersistTaps="handled">{children}</ScrollView>
    </Animated.View>
  );
};

const DateSelector: React.FC<DateSelectorProps> = ({
  label,
  lang = 'English',
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
  themeMode = 'system',
  theme: propTheme,
  translations: customTranslations,
  containerStyle,
  labelStyle,
  inputStyle,
  dropdownStyle,
  dropdownItemStyle,
}) => {
  // Theme Setup
  const systemColorScheme = useColorScheme();
  const isDark = systemColorScheme === 'dark';
  const activeMode = themeMode === 'system' ? (isDark ? 'dark' : 'light') : themeMode;
  const baseTheme = activeMode === 'dark' ? darkTheme : lightTheme;

  const theme = useMemo<Required<DateSelectorTheme>>(() => {
    return {
      ...baseTheme,
      ...propTheme,
    };
  }, [baseTheme, propTheme]);

  // Translations Setup
  const activeTranslations = useMemo(() => {
    const found =
      customTranslations?.[lang] ||
      defaultTranslations[lang] ||
      defaultTranslations.English;
    return found || {
      year: 'Year',
      month: 'Month',
      day: 'Day',
      age: 'Age',
    };
  }, [lang, customTranslations]);

  // Parse Initial Date
  const initialDate = useMemo(() => {
    return parseDateString(baseDate);
  }, [baseDate]);

  // Component States
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

  // Dropdown States
  const [showYearList, setShowYearList] = useState(false);
  const [showMonthList, setShowMonthList] = useState(false);
  const [showDayList, setShowDayList] = useState(false);

  // Focus States
  const [isYearFocused, setIsYearFocused] = useState(false);
  const [isMonthFocused, setIsMonthFocused] = useState(false);
  const [isDayFocused, setIsDayFocused] = useState(false);

  // Layout Measurement for Responsiveness
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setContainerWidth(event.nativeEvent.layout.width);
  }, []);

  const isNarrow = containerWidth !== null && containerWidth < 400;

  // Refs for auto-focus progression
  const yearInputRef = useRef<any>(null);
  const monthInputRef = useRef<any>(null);
  const dayInputRef = useRef<any>(null);

  // Lists Generation
  const yearList = useMemo(() => {
    const maxYear = initialDate.getFullYear();
    return Array.from({ length: maxYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();
  }, [initialDate.getFullYear()]);

  const daysInMonth = useMemo(() => {
    return getDaysInMonth(month ?? 1, year ?? new Date().getFullYear());
  }, [month, year]);

  const baseDateObj = useMemo(() => {
    const parsed = baseDate ? new Date(baseDate) : null;
    return parsed && !isNaN(parsed.getTime()) ? parsed : new Date();
  }, [baseDate]);

  // Sync with baseDate updates
  useEffect(() => {
    if (allowNullStart) return;

    if (baseDate) {
      const y = initialDate.getFullYear();
      const m = initialDate.getMonth() + 1;
      const d = initialDate.getDate();

      setYear(y);
      setYearInput(y.toString());
      setMonth(m);
      setMonthInput(months[m - 1]?.name || '');
      setDay(d);
      setDayInput(pad(d));
    }
  }, [baseDate, initialDate, allowNullStart]);

  // Trigger onDateChange callbacks & calculate age
  useEffect(() => {
    const today = new Date();
    const effectiveYear = year ?? today.getFullYear();
    const effectiveMonth = month ?? today.getMonth() + 1;
    const effectiveDay = day ?? today.getDate();

    const birthDate = new Date(effectiveYear, effectiveMonth - 1, effectiveDay);
    const calculatedAge = calculateAge(birthDate, baseDateObj);

    setAge(showAge ? calculatedAge : null);

    if (year && month && day) {
      const formatted = formatDate(day, month, year, returnFormat);
      onDateChange(formatted, showAge ? calculatedAge : null);
    }
  }, [year, month, day, showAge, returnFormat, baseDateObj]);

  // Reset logic
  useEffect(() => {
    if (!resetIfNullState) {
      const yy = initialDate.getFullYear();
      const mm = initialDate.getMonth() + 1;
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

    setYearInput('');
    setMonthInput('');
    setDayInput('');
    setShowYearList(false);
    setShowMonthList(false);
    setShowDayList(false);
  }, [year, month, day, resetIfNullState, initialDate]);

  // Dropdown list filters
  const filteredYearList = useMemo(() => {
    if (!yearInput) return yearList;
    return yearList.filter((y) => y.toString().startsWith(yearInput));
  }, [yearInput, yearList]);

  const filteredMonthList = useMemo(() => {
    if (!monthInput) return months;
    return months.filter(
      (m) =>
        m.name.toLowerCase().startsWith(monthInput.toLowerCase()) ||
        m.value.toString().startsWith(monthInput)
    );
  }, [monthInput]);

  const filteredDayList = useMemo(() => {
    const totalDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    if (!dayInput) return totalDays;
    return totalDays.filter((d) => d.toString().startsWith(dayInput));
  }, [dayInput, daysInMonth]);

  // Selection handlers
  const handleSelectYear = useCallback((item: number) => {
    setYear(item);
    setYearInput(item.toString());
    setShowYearList(false);
    setTimeout(() => {
      monthInputRef.current?.focus();
    }, 50);
  }, []);

  const handleSelectMonth = useCallback((value: number, name: string) => {
    setMonth(value);
    setMonthInput(name);
    setShowMonthList(false);
    setTimeout(() => {
      dayInputRef.current?.focus();
    }, 50);
  }, []);

  const handleSelectDay = useCallback((item: number) => {
    setDay(item);
    setDayInput(pad(item));
    setShowDayList(false);
    dayInputRef.current?.blur();
  }, []);

  // Safe timeout blurs to allow press events to complete first
  const handleYearBlur = useCallback(() => {
    setIsYearFocused(false);
    setTimeout(() => setShowYearList(false), 200);
  }, []);

  const handleMonthBlur = useCallback(() => {
    setIsMonthFocused(false);
    setTimeout(() => setShowMonthList(false), 200);
  }, []);

  const handleDayBlur = useCallback(() => {
    setIsDayFocused(false);
    setTimeout(() => {
      setShowDayList(false);

      const parsed = parseInt(dayInput, 10);
      const maxDay = getDaysInMonth(month ?? 1, year ?? new Date().getFullYear());

      if (!parsed || parsed < 1 || parsed > maxDay) {
        const fallback = day ?? 5;
        setDayInput(pad(fallback));
        setDay(fallback);
        return;
      }

      setDay(parsed);
      setDayInput(pad(parsed));
    }, 200);
  }, [dayInput, day, month, year]);

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.containerRow,
        isNarrow && styles.containerRowNarrow,
        containerStyle,
      ]}
    >
      <View style={[styles.leftColumn, isNarrow && styles.leftColumnNarrow]}>
        <Text
          style={[
            styles.label,
            {
              color: theme.labelColor,
              fontFamily: theme.fontFamily,
              fontSize: theme.fontSizeLabel,
            },
            labelStyle,
          ]}
        >
          {label}:
        </Text>

        <View style={styles.inputsGrid}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text
              style={[
                styles.headerText,
                { color: theme.columnLabelColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeSubLabel },
              ]}
            >
              {activeTranslations.year}
            </Text>
            <Text
              style={[
                styles.headerText,
                { color: theme.columnLabelColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeSubLabel },
              ]}
            >
              {activeTranslations.month}
            </Text>
            <Text
              style={[
                styles.headerText,
                { color: theme.columnLabelColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeSubLabel },
              ]}
            >
              {activeTranslations.day}
            </Text>
          </View>

          {/* Inputs Row */}
          <View style={styles.inputRow}>
            {/* YEAR INPUT */}
            <View style={styles.inputContainer}>
              <View style={styles.fieldWrapper}>
                <TextInput
                  ref={yearInputRef}
                  testID="date-selector-year"
                  style={[
                    styles.input,
                    {
                      color: theme.textColor,
                      borderColor: isYearFocused ? theme.focusBorderColor : theme.borderColor,
                      borderWidth: isYearFocused ? 1.5 : 1,
                      borderRadius: theme.borderRadius,
                      backgroundColor: IsYearEdit ? theme.backgroundColor : theme.disabledBackgroundColor,
                      paddingVertical: theme.inputPaddingVertical,
                      fontSize: theme.fontSize,
                      fontFamily: theme.fontFamily,
                    },
                    !IsYearEdit && { color: theme.disabledTextColor },
                    inputStyle,
                  ]}
                  keyboardType="numeric"
                  maxLength={4}
                  value={yearInput}
                  editable={IsYearEdit}
                  onFocus={() => {
                    setIsYearFocused(true);
                    setShowYearList(true);
                  }}
                  onBlur={handleYearBlur}
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
                        setTimeout(() => {
                          monthInputRef.current?.focus();
                        }, 50);
                      } else {
                        setYear(null);
                        setYearInput('');
                      }
                    }
                  }}
                  accessibilityLabel="Year field"
                  accessibilityHint="Enter a four-digit year"
                  accessibilityRole="spinbutton"
                />
                {IsYearEdit && (
                  <TouchableOpacity
                    style={styles.caretOverlay}
                    onPress={() => {
                      if (showYearList) {
                        yearInputRef.current?.blur();
                      } else {
                        yearInputRef.current?.focus();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <DropdownCaret color={isYearFocused ? theme.primaryColor : theme.columnLabelColor} />
                  </TouchableOpacity>
                )}
              </View>

              <AnimatedDropdown visible={showYearList && IsYearEdit} theme={theme} dropdownStyle={dropdownStyle}>
                {filteredYearList.map((item) => {
                  const isSelected = item === year;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        isSelected && { backgroundColor: theme.dropdownSelectedBackgroundColor },
                      ]}
                      onPress={() => handleSelectYear(item)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: isSelected ? theme.dropdownSelectedTextColor : theme.dropdownItemTextColor,
                            fontFamily: theme.fontFamily,
                            fontSize: theme.fontSize,
                          },
                          dropdownItemStyle,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </AnimatedDropdown>
            </View>

            {/* MONTH INPUT */}
            <View style={styles.inputContainer}>
              <View style={styles.fieldWrapper}>
                <TextInput
                  ref={monthInputRef}
                  testID="date-selector-month"
                  style={[
                    styles.input,
                    {
                      color: theme.textColor,
                      borderColor: isMonthFocused ? theme.focusBorderColor : theme.borderColor,
                      borderWidth: isMonthFocused ? 1.5 : 1,
                      borderRadius: theme.borderRadius,
                      backgroundColor: IsMonthEdit ? theme.backgroundColor : theme.disabledBackgroundColor,
                      paddingVertical: theme.inputPaddingVertical,
                      fontSize: theme.fontSize,
                      fontFamily: theme.fontFamily,
                    },
                    !IsMonthEdit && { color: theme.disabledTextColor },
                    inputStyle,
                  ]}
                  maxLength={3}
                  value={monthInput}
                  editable={IsMonthEdit}
                  onFocus={() => {
                    setIsMonthFocused(true);
                    setShowMonthList(true);
                  }}
                  onBlur={handleMonthBlur}
                  onChangeText={(text) => {
                    setMonthInput(text);
                    setShowMonthList(true);
                    const trimmed = text.trim();

                    if (/^(0[1-9]|1[0-2])$/.test(trimmed)) {
                      const n = parseInt(trimmed, 10);
                      setMonth(n);
                      setMonthInput(months[n - 1]?.name || '');
                      setShowMonthList(false);
                      setTimeout(() => {
                        dayInputRef.current?.focus();
                      }, 50);
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
                        setTimeout(() => {
                          dayInputRef.current?.focus();
                        }, 50);
                      }
                    }
                  }}
                  accessibilityLabel="Month field"
                  accessibilityHint="Type month name or double digit number"
                  accessibilityRole="combobox"
                />
                {IsMonthEdit && (
                  <TouchableOpacity
                    style={styles.caretOverlay}
                    onPress={() => {
                      if (showMonthList) {
                        monthInputRef.current?.blur();
                      } else {
                        monthInputRef.current?.focus();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <DropdownCaret color={isMonthFocused ? theme.primaryColor : theme.columnLabelColor} />
                  </TouchableOpacity>
                )}
              </View>

              <AnimatedDropdown visible={showMonthList && IsMonthEdit} theme={theme} dropdownStyle={dropdownStyle}>
                {filteredMonthList.map((item) => {
                  const isSelected = item.value === month;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownItem,
                        isSelected && { backgroundColor: theme.dropdownSelectedBackgroundColor },
                      ]}
                      onPress={() => handleSelectMonth(item.value, item.name)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: isSelected ? theme.dropdownSelectedTextColor : theme.dropdownItemTextColor,
                            fontFamily: theme.fontFamily,
                            fontSize: theme.fontSize,
                          },
                          dropdownItemStyle,
                        ]}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </AnimatedDropdown>
            </View>

            {/* DAY INPUT */}
            <View style={styles.inputContainer}>
              <View style={styles.fieldWrapper}>
                <TextInput
                  ref={dayInputRef}
                  testID="date-selector-day"
                  style={[
                    styles.input,
                    {
                      color: theme.textColor,
                      borderColor: isDayFocused ? theme.focusBorderColor : theme.borderColor,
                      borderWidth: isDayFocused ? 1.5 : 1,
                      borderRadius: theme.borderRadius,
                      backgroundColor: IsDayEdit ? theme.backgroundColor : theme.disabledBackgroundColor,
                      paddingVertical: theme.inputPaddingVertical,
                      fontSize: theme.fontSize,
                      fontFamily: theme.fontFamily,
                    },
                    !IsDayEdit && { color: theme.disabledTextColor },
                    inputStyle,
                  ]}
                  keyboardType="numeric"
                  maxLength={2}
                  value={dayInput}
                  editable={IsDayEdit}
                  onFocus={() => {
                    setIsDayFocused(true);
                    setShowDayList(true);
                  }}
                  onBlur={handleDayBlur}
                  onChangeText={(text) => {
                    const clean = text.replace(/[^0-9]/g, '');
                    setDayInput(clean);

                    const parsed = parseInt(clean, 10);
                    const maxDay = getDaysInMonth(month ?? 1, year ?? new Date().getFullYear());

                    if (clean.length === 2) {
                      if (parsed >= 1 && parsed <= maxDay) {
                        setDay(parsed);
                        setDayInput(pad(parsed));
                        setShowDayList(false);
                        dayInputRef.current?.blur();
                      }
                    }
                  }}
                  accessibilityLabel="Day field"
                  accessibilityHint="Enter double digit day of month"
                  accessibilityRole="spinbutton"
                />
                {IsDayEdit && (
                  <TouchableOpacity
                    style={styles.caretOverlay}
                    onPress={() => {
                      if (showDayList) {
                        dayInputRef.current?.blur();
                      } else {
                        dayInputRef.current?.focus();
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <DropdownCaret color={isDayFocused ? theme.primaryColor : theme.columnLabelColor} />
                  </TouchableOpacity>
                )}
              </View>

              <AnimatedDropdown visible={showDayList && IsDayEdit} theme={theme} dropdownStyle={dropdownStyle}>
                {filteredDayList.map((item) => {
                  const isSelected = item === day;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.dropdownItem,
                        isSelected && { backgroundColor: theme.dropdownSelectedBackgroundColor },
                      ]}
                      onPress={() => handleSelectDay(item)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          {
                            color: isSelected ? theme.dropdownSelectedTextColor : theme.dropdownItemTextColor,
                            fontFamily: theme.fontFamily,
                            fontSize: theme.fontSize,
                          },
                          dropdownItemStyle,
                        ]}
                      >
                        {pad(item)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </AnimatedDropdown>
            </View>
          </View>
        </View>

        {/* Responsive Age display (under inputs when narrow) */}
        {showAge && isNarrow && (
          <View
            style={[
              styles.agePill,
              {
                backgroundColor: theme.primaryColor + '10',
                borderRadius: theme.borderRadius,
                borderColor: theme.primaryColor + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.agePillLabel,
                { color: theme.textColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeSubLabel + 1 },
              ]}
            >
              {activeTranslations.age}:
            </Text>
            <Text
              style={[
                styles.agePillValue,
                { color: theme.primaryColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeLabel },
              ]}
            >
              {age !== null ? `${age} ${age === 1 ? 'year' : 'years'}` : '-'}
            </Text>
          </View>
        )}
      </View>

      {/* Side Age display (only when wide) */}
      {showAge && !isNarrow && (
        <View style={styles.rightColumn}>
          <Text style={[styles.label, { color: 'transparent', fontSize: theme.fontSizeLabel }]}>Age</Text>

          <View style={styles.ageContainer}>
            <Text
              style={[
                styles.ageLabel,
                { color: theme.columnLabelColor, fontFamily: theme.fontFamily, fontSize: theme.fontSizeSubLabel },
              ]}
            >
              {activeTranslations.age}
            </Text>

            <TextInput
              style={[
                styles.ageInput,
                {
                  color: theme.textColor,
                  backgroundColor: theme.disabledBackgroundColor,
                  borderColor: theme.borderColor,
                  borderRadius: theme.borderRadius,
                  paddingVertical: theme.inputPaddingVertical,
                  fontSize: theme.fontSize,
                  fontFamily: theme.fontFamily,
                },
                inputStyle,
              ]}
              editable={false}
              value={age?.toString() || ''}
              accessibilityLabel="Calculated age"
              accessibilityRole="text"
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
    marginBottom: 12,
  },
  containerRowNarrow: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  leftColumn: {
    width: '75%',
    paddingRight: 6,
  },
  leftColumnNarrow: {
    width: '100%',
    paddingRight: 0,
  },
  rightColumn: {
    width: '25%',
    paddingLeft: 10,
  },
  label: {
    marginVertical: 6,
    fontWeight: '600',
  },
  inputsGrid: {
    flexDirection: 'column',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  headerText: {
    fontWeight: '500',
    width: '33.3%',
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    width: '32%',
    position: 'relative',
  },
  fieldWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
    // Add right padding to prevent text overlapping caret arrow
    paddingRight: 18,
  },
  caretOverlay: {
    position: 'absolute',
    right: 8,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: 'absolute',
    top: 48,
    width: '100%',
    borderWidth: 1,
    zIndex: 100,
    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    // Android elevation (which does not clip if parents don't clip)
  },
  dropdownItem: {
    paddingVertical: 14, // Touch target height check (ensure comfortable tapping size >= 48dp)
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontWeight: '500',
  },
  ageContainer: {
    flexDirection: 'column',
  },
  ageLabel: {
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 6,
  },
  ageInput: {
    borderWidth: 1,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  agePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  agePillLabel: {
    fontWeight: '600',
    marginRight: 6,
  },
  agePillValue: {
    fontWeight: '700',
  },
});
