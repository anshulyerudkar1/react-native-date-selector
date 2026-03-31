import { useState } from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import {DateSelector} from 'react-native-date-selector';

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [age, setAge] = useState<number | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Date Selector Example</Text>

      <DateSelector
        label="Date of Birth"
        lang="English"
        showAge
        baseDate=""
        returnFormat="DD/MM/YYYY"
        onDateChange={(formatted, age) => {
          setSelectedDate(typeof formatted === 'string' ? formatted : formatted.toString());
          setAge(age);
        }}
      />

      <DateSelector
        label="Test Date"
        lang="English"
        showAge={false}
        baseDate=""
        returnFormat="DD/MM/YYYY"
        onDateChange={(formatted, age) => {
          setSelectedDate(typeof formatted === 'string' ? formatted : formatted.toString());
          setAge(age);
        }}
      />

      <Text style={styles.text}>Selected: {selectedDate || '-'}</Text>
      <Text style={styles.text}>Age: {age ?? '-'}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
});
