import { useDirection } from '@/lib/hooks/useDirection';
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
}) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const [year, setYear] = useState(selectedDate ? parseInt(selectedDate.split('/')[0], 10) : 1370);
  const [month, setMonth] = useState(selectedDate ? parseInt(selectedDate.split('/')[1], 10) : 1);
  const [day, setDay] = useState(selectedDate ? parseInt(selectedDate.split('/')[2], 10) : 1);

  const persianMonths = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
  ];

  const getDaysInMonth = (m: number, y: number) => {
    if (m <= 6) return 31;
    if (m <= 11) return 30;
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
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text, ...direction.text }]}>
          {t('year', { defaultValue: direction.isRTL ? 'سال' : 'Year' })}
        </Text>
        <View style={[styles.picker, direction.row]}>
          {years.slice(Math.max(0, year - 1305), Math.max(10, year - 1295)).map((item) => (
            <PickerOption
              key={item}
              label={String(item)}
              active={year === item}
              onPress={() => setYear(item)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text, ...direction.text }]}>
          {t('month', { defaultValue: direction.isRTL ? 'ماه' : 'Month' })}
        </Text>
        <View style={[styles.picker, direction.row]}>
          {persianMonths.map((item, index) => (
            <PickerOption
              key={item}
              label={item}
              active={month === index + 1}
              onPress={() => setMonth(index + 1)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text, ...direction.text }]}>
          {t('day', { defaultValue: direction.isRTL ? 'روز' : 'Day' })}
        </Text>
        <View style={[styles.picker, direction.row]}>
          {Array.from({ length: days }, (_, i) => i + 1).map((item) => (
            <PickerOption
              key={item}
              label={String(item)}
              active={day === item}
              onPress={() => setDay(item)}
            />
          ))}
        </View>
      </View>

      <Button type="primary" size="large" onPress={handleConfirm} fullWidth className="mt-4">
        {t('ok', { defaultValue: direction.isRTL ? 'تایید' : 'Confirm' })}
      </Button>
    </View>
  );
};

function PickerOption({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.option,
        { backgroundColor: active ? colors.primary : isDark ? colors.surface : '#f5f5f5' },
      ]}
    >
      <Text style={[styles.optionText, { color: active ? '#ffffff' : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

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
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'IRANSans',
  },
});

export default DatePickerJalali;
