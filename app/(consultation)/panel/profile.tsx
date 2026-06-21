import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/styles/theme';

export default function ConsultationProfileScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontFamily: 'IRANSans-Bold' }}>Profile / Settings</Text>
    </View>
  );
}
