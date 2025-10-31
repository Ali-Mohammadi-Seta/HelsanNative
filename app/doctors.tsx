// app/doctors.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';

export default function DoctorsScreen() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#ffffff' }]}>
      <Text style={[styles.title, { color: isDark ? colors.text : '#000000' }]}>
        👨‍⚕️ Doctors
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'IRANSans-Bold',
  },
});