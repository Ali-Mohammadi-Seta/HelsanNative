import { useTheme } from '@/styles/theme';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../Button';

interface DatePickerJalaliProps {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  maxDate?: Date;
  minDate?: Date;
}

const DatePickerJalali: React.FC<DatePickerJalaliProps> = ({
  selectedDate,
  onDateChange,
  maxDate = new Date(),
  minDate,
}) => {
  const { t, i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const isRTL = i18n.language === 'fa';

  const [year, setYear] = useState(selectedDate ? parseInt(selectedDate.split('/')[0]) : 1370);
  const [month, setMonth] = useState(selectedDate ? parseInt(selectedDate.split('/')[1]) : 1);
  const [day, setDay] = useState(selectedDate ? parseInt(selectedDate.split('/')[2]) : 1);

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const getDaysInMonth = (m: number, y: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
    // Check leap year for Esfand
    const isLeap = ((y % 33) * 8 + 21) % 128 < 8;
    return isLeap ? 30 : 29;
  };

  const days = getDaysInMonth(month, year);
  const years = Array.from({ length: 100 }, (_, i) => 1300 + i);

  const handleConfirm = () => {
    const dateStr = `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
    onDateChange(dateStr);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.card : '#ffffff' }]}>
      {/* Year Picker */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? colors.text : '#000000' }]}>
          {t('year') || 'سال'}
        </Text>
        <View style={styles.picker}>
          {years.slice(year - 1305, year - 1295).map((y) => (
            <TouchableOpacity
              key={y}
              onPress={() => setYear(y)}
              style={[
                styles.option,
                { backgroundColor: year === y ? colors.primary : (isDark ? colors.surface : '#f5f5f5') },
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: year === y ? '#ffffff' : (isDark ? colors.text : '#000000') }
              ]}>
                {y}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Month Picker */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? colors.text : '#000000' }]}>
          {t('month') || 'ماه'}
        </Text>
        <View style={styles.picker}>
          {persianMonths.map((m, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setMonth(idx + 1)}
              style={[
                styles.option,
                { backgroundColor: month === idx + 1 ? colors.primary : (isDark ? colors.surface : '#f5f5f5') },
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: month === idx + 1 ? '#ffffff' : (isDark ? colors.text : '#000000') }
              ]}>
                {m}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Day Picker */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: isDark ? colors.text : '#000000' }]}>
          {t('day') || 'روز'}
        </Text>
        <View style={styles.picker}>
          {Array.from({ length: days }, (_, i) => i + 1).map((d) => (
            <TouchableOpacity
              key={d}
              onPress={() => setDay(d)}
              style={[
                styles.option,
                { backgroundColor: day === d ? colors.primary : (isDark ? colors.surface : '#f5f5f5') },
              ]}
            >
              <Text style={[
                styles.optionText,
                { color: day === d ? '#ffffff' : (isDark ? colors.text : '#000000') }
              ]}>
                {d}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Confirm Button */}
      <Button type="primary" size="large" onPress={handleConfirm} fullWidth className="mt-4">
        {t('ok') || 'تأیید'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'IRANSans-Bold',
    marginBottom: 8,
  },
  picker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    // Note: backgroundColor should be set dynamically in the component
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'IRANSans',
  },
});

export default DatePickerJalali;