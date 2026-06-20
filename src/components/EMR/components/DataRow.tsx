// src/components/EMR/components/DataRow.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';

interface DataRowProps {
  label: string;
  value?: string | number | null;
  last?: boolean;
  valueColor?: string;
}

const DataRow: React.FC<DataRowProps> = ({ label, value, last = false, valueColor }) => {
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  return (
    <View
      style={[
        styles.row,
        {
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: isDark ? colors.border : '#f3f4f6',
        },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: colors.textSecondary, writingDirection: direction.dir },
        ]}
      >
        {label}
      </Text>
      <Text
        style={[
          styles.value,
          {
            color: valueColor ?? colors.text,
            writingDirection: direction.dir,
            textAlign: direction.isRTL ? 'left' : 'right',
          },
        ]}
      >
        {value ?? '-'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    gap: 8,
  },
  label: {
    fontFamily: 'IRANSans',
    fontSize: 13,
    flex: 1,
  },
  value: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
    flexShrink: 1,
    maxWidth: '55%',
  },
});

export default DataRow;