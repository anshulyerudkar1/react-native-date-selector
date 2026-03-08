# react-native-date-selector

A lightweight and customizable React Native date selector component that lets users pick day/month/year (with dropdown suggestions), supports multiple date formats, optional age calculation, and localization.

## Installation

```sh
npm install react-native-date-selector
```

## Usage

```tsx
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import DateSelector from 'react-native-date-selector';

export default function MyScreen() {
  const [selectedDate, setSelectedDate] = useState('');
  const [age, setAge] = useState<number | null>(null);

  return (
    <View>
      <DateSelector
        label="Date of Birth"
        lang="English"
        showAge
        baseDate="1990-05-20"
        returnFormat="DD/MM/YYYY"
        onDateChange={(formatted, age) => {
          setSelectedDate(typeof formatted === 'string' ? formatted : formatted.toString());
          setAge(age);
        }}
      />

      <Text>Selected: {selectedDate || '-'}</Text>
      <Text>Age: {age ?? '-'}</Text>
    </View>
  );
}
```

## Utilities

You can also use the underlying date helpers directly (e.g., for formatting/parsing without the UI component):

```ts
import {
  formatDate,
  parseDateString,
  calculateAge,
} from 'react-native-date-selector';

const date = parseDateString('15-01-2020');
const formatted = formatDate(date.getDate(), date.getMonth() + 1, date.getFullYear(), 'DD/MM/YYYY');
const age = calculateAge(date, new Date());
```

## Example app

To run the example app in this repo:

```sh
# from the repo root
npm install
cd example
npm install
npx react-native start
# in another terminal
npx react-native run-ios
# or
npx react-native run-android
```

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
# react-native-date-selector
A lightweight and customizable React Native date selector component that allows users to input day, month, and year with dropdown suggestions, supports multiple date formats, optional age calculation, and localization.
