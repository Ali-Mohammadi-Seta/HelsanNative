// app/(tabs)/explore.tsx
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { Header } from '@/components'; // ✅ ADD THIS

export default function ExploreScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ ADD HEADER */}
      <Header title={t('search')} />
      
      <View style={[styles.container, { backgroundColor: isDark ? colors.background : '#ffffff' }]}>
        <View style={styles.content}>
          <Text style={[styles.subtitle, { color: isDark ? colors.textSecondary : '#666666' }]}>
            Search functionality coming soon!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'IRANSans',
    textAlign: 'center',
  },
});