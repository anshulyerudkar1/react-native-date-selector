import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';

export interface DateSelectorTheme {
  primaryColor?: string;                  // Active border, focus outlines, button highlights
  backgroundColor?: string;               // Background of inputs and container
  textColor?: string;                     // Core text color
  labelColor?: string;                    // Main header label color (e.g. "Date of Birth:")
  columnLabelColor?: string;              // Minor column header color (e.g. "Year", "Month")
  borderColor?: string;                   // Inactive input border color
  focusBorderColor?: string;              // Focused input border color
  disabledBackgroundColor?: string;       // Background color for disabled state
  disabledTextColor?: string;             // Text color for disabled state
  placeholderColor?: string;              // Placeholder text color
  dropdownBackgroundColor?: string;       // Suggestion dropdown container background
  dropdownItemTextColor?: string;         // Suggestion item text color
  dropdownSelectedBackgroundColor?: string; // Selected suggestion item background
  dropdownSelectedTextColor?: string;     // Selected suggestion item text color
  dropdownBorderColor?: string;           // Border color of dropdown list
  errorColor?: string;                    // Error text & error outline color
  borderRadius?: number;                  // Global border radius for inputs and dropdowns
  inputPaddingVertical?: number;          // Vertical padding for input fields
  inputPaddingHorizontal?: number;        // Horizontal padding for input fields
  fontSize?: number;                      // Font size of input text
  fontSizeLabel?: number;                 // Font size of main label
  fontSizeSubLabel?: number;              // Font size of minor labels (Year, Month, Day)
  fontFamily?: string;                    // Typography font family override
  elevation?: number;                     // Dropdown shadow elevation (Android)
  shadowOpacity?: number;                 // Dropdown shadow opacity (iOS)
}

export interface LocaleTranslations {
  year: string;
  month: string;
  day: string;
  age: string;
}

export type SupportedLanguage = 'English' | 'Marathi' | 'Hindi';

export interface DateSelectorProps {
  label: string;
  lang?: SupportedLanguage | string;
  showAge?: boolean;
  baseDate?: string | null;
  returnFormat?: DateFormat;
  allowNullStart?: boolean;
  onDateChange: (formattedDate: string, age: number | null) => void;
  IsYearEdit?: boolean;
  IsMonthEdit?: boolean;
  IsDayEdit?: boolean;
  resetIfNullState?: boolean;
  allowFutureYear?: boolean;
  
  // Customization Props
  themeMode?: 'light' | 'dark' | 'system';
  theme?: DateSelectorTheme;              // Complete custom theme values
  translations?: Record<string, LocaleTranslations>; // Custom languages override
  
  // Custom Styles
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  dropdownStyle?: StyleProp<ViewStyle>;
  dropdownItemStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
}
