import type { ReactNode } from 'react';

// Mock react-native core components so tests can run without native modules.
jest.mock('react-native', () => {
  const React = require('react');
  void jest.requireActual('react-native');

  const createStub = (name: string) => {
    const Component = ({ children, ...props }: { children?: ReactNode }) =>
      React.createElement(name, props, children);
    Component.displayName = name;
    return Component;
  };

  // We intentionally avoid spreading the real module here because
  // some helpers inside `react-native` rely on React internals that
  // don't run cleanly in this test environment.
  return {
    View: createStub('View'),
    Text: createStub('Text'),
    TextInput: createStub('TextInput'),
    TouchableOpacity: createStub('TouchableOpacity'),
    ScrollView: createStub('ScrollView'),
    useColorScheme: () => 'light',
    StyleSheet: {
      create: <T extends object>(obj: T): T => obj,
      flatten: (style: any) => style,
    },
  };
});

jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  let Actual: any = {};
  try {
    Actual = jest.requireActual('react-native-gesture-handler');
  } catch {
    // ignore; we only need the minimal mocks for tests
  }

  const View = ({ children, ...props }: { children?: ReactNode }) =>
    React.createElement('View', props, children);

  return {
    ...Actual,
    ScrollView: View,
    GestureHandlerRootView: View,
    TouchableOpacity: View,
  };
});

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DateSelector from '../DateSelector';

describe('DateSelector', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-04-05T00:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('calls onDateChange on mount with formatted baseDate', () => {
    const onDateChange = jest.fn();

    render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="2020-01-15"
        showAge
        onDateChange={onDateChange}
      />
    );

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith('15/01/2020', 0);
  });

  it('falls back to today when baseDate is invalid', () => {
    const onDateChange = jest.fn();

    render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="not-a-date"
        showAge
        onDateChange={onDateChange}
      />
    );

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(onDateChange).toHaveBeenCalledWith('05/04/2025', 0);
  });

  it('does not call onDateChange if invalid day is entered after allowNullStart', async () => {
    const onDateChange = jest.fn();

    const { getByTestId } = render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="2020-01-10"
        showAge
        allowNullStart
        onDateChange={onDateChange}
      />
    );

    expect(onDateChange).not.toHaveBeenCalled();

    fireEvent.changeText(getByTestId('date-selector-year'), '1990');
    fireEvent.changeText(getByTestId('date-selector-month'), '02');
    fireEvent.changeText(getByTestId('date-selector-day'), '31');
    fireEvent(getByTestId('date-selector-day'), 'blur');

    await waitFor(() => {
      expect(getByTestId('date-selector-day').props.value).toBe('05');
      expect(onDateChange).toHaveBeenLastCalledWith('05/02/1990', 29);
    });
  });

  it('allows future year when allowFutureYear is true and blocks it when false', async () => {
    const now = new Date();
    const nextYear = now.getFullYear() + 1;

    const onDateChangeAllow = jest.fn();
    const { getByTestId: getByTestIdAllow } = render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="2020-01-10"
        showAge
        allowNullStart
        allowFutureYear
        onDateChange={onDateChangeAllow}
      />
    );

    fireEvent.changeText(getByTestIdAllow('date-selector-year'), nextYear.toString());

    await waitFor(() => {
      expect(onDateChangeAllow).toHaveBeenCalled();
      expect(onDateChangeAllow).toHaveBeenCalledWith(
        expect.stringContaining(nextYear.toString()),
        expect.any(Number)
      );
    });

    const onDateChangeBlock = jest.fn();
    const { getByTestId: getByTestIdBlock } = render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="2020-01-10"
        showAge
        allowNullStart
        allowFutureYear={false}
        onDateChange={onDateChangeBlock}
      />
    );

    fireEvent.changeText(getByTestIdBlock('date-selector-year'), nextYear.toString());

    await waitFor(() => {
      expect(onDateChangeBlock).not.toHaveBeenCalled();
      expect(getByTestIdBlock('date-selector-year').props.value).toBe('');
    });
  });

  it('clears inputs when resetIfNullState is true', () => {
    const onDateChange = jest.fn();

    const { getByTestId } = render(
      <DateSelector
        label="DOB"
        lang="English"
        baseDate="2020-01-15"
        showAge
        resetIfNullState
        onDateChange={onDateChange}
      />
    );

    expect(onDateChange).toHaveBeenCalledTimes(1);
    expect(getByTestId('date-selector-year').props.value).toBe('');
    expect(getByTestId('date-selector-month').props.value).toBe('');
    expect(getByTestId('date-selector-day').props.value).toBe('');
  });
});
