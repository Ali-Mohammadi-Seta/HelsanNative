// src/components/DatePicker/DatePickerJalali.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import DatePicker from '@hassanmojab/react-modern-calendar-datepicker';
import { useTheme } from '@/styles/theme';
import moment from 'moment-jalaali';

interface DatePickerJalaliProps {
  selectedDate?: string;
  onDateChange: (date: string) => void;
  maxDate?: string;
  minDate?: string;
}

export default function DatePickerJalali({
  selectedDate,
  onDateChange,
  maxDate,
  minDate,
}: DatePickerJalaliProps) {
  const { colors, isDark } = useTheme();

  // Get today in Jalali format (YYYY/MM/DD)
  const today = moment().format('jYYYY/jMM/jDD');

  return (
    <View>
      <DatePicker
        mode="calendar"
        selected={selectedDate}
        onDateChange={onDateChange}
        options={{
          backgroundColor: isDark ? colors.card : colors.background,
          textHeaderColor: colors.primary,
          textDefaultColor: isDark ? colors.text : '#000000',
          selectedTextColor: '#fff',
          mainColor: colors.primary,
          textSecondaryColor: isDark ? '#888888' : '#666666',
          borderColor: isDark ? colors.border : '#e0e0e0',
        }}
        current={today}
        maximumDate={maxDate || today}
        minimumDate={minDate}
        style={{ borderRadius: 12 }}
      />
    </View>
  );
}