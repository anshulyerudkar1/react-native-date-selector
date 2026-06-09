import type { DateSelectorTheme } from '../types';

export const lightTheme: Required<DateSelectorTheme> = {
  primaryColor: '#3b82f6', // Tailwind blue-500
  backgroundColor: '#ffffff',
  textColor: '#1f2937', // Cool gray-800
  labelColor: '#111827', // Cool gray-900
  columnLabelColor: '#4b5563', // Cool gray-600
  borderColor: '#d1d5db', // Gray-300
  focusBorderColor: '#3b82f6',
  disabledBackgroundColor: '#f3f4f6', // Gray-100
  disabledTextColor: '#9ca3af', // Gray-400
  placeholderColor: '#9ca3af',
  dropdownBackgroundColor: '#ffffff',
  dropdownItemTextColor: '#374151', // Gray-700
  dropdownSelectedBackgroundColor: '#eff6ff', // Light blue-50
  dropdownSelectedTextColor: '#2563eb', // Blue-600
  dropdownBorderColor: '#e5e7eb',
  errorColor: '#ef4444', // Red-500
  borderRadius: 10, // Modern premium rounded corners
  inputPaddingVertical: 12,
  inputPaddingHorizontal: 16,
  fontSize: 16,
  fontSizeLabel: 16,
  fontSizeSubLabel: 12,
  elevation: 6,
  shadowOpacity: 0.15,
  fontFamily: 'System',
};

export const darkTheme: Required<DateSelectorTheme> = {
  primaryColor: '#60a5fa', // Tailwind blue-400
  backgroundColor: '#1f2937', // Gray-800
  textColor: '#f9fafb', // Gray-50
  labelColor: '#f9fafb',
  columnLabelColor: '#9ca3af', // Gray-400
  borderColor: '#4b5563', // Gray-600
  focusBorderColor: '#60a5fa',
  disabledBackgroundColor: '#374151', // Gray-700
  disabledTextColor: '#6b7280', // Gray-500
  placeholderColor: '#6b7280',
  dropdownBackgroundColor: '#1f2937',
  dropdownItemTextColor: '#e5e7eb', // Gray-200
  dropdownSelectedBackgroundColor: '#1e3a8a', // Dark blue
  dropdownSelectedTextColor: '#60a5fa', // Light blue-400
  dropdownBorderColor: '#374151',
  errorColor: '#f87171', // Red-400
  borderRadius: 10,
  inputPaddingVertical: 12,
  inputPaddingHorizontal: 16,
  fontSize: 16,
  fontSizeLabel: 16,
  fontSizeSubLabel: 12,
  elevation: 6,
  shadowOpacity: 0.3,
  fontFamily: 'System',
};
