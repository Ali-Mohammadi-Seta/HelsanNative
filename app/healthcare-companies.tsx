// app/healthcare-companies.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { BackHeader } from '@/components';

export default function HealthcareCompaniesScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title={t('healthcareCompaniesList')} />

      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? colors.background : '#ffffff' }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: isDark ? colors.text : '#000000' }]}>
          🏢 {t('healthcareCompaniesList')}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontFamily: 'IRANSans-Bold',
  },
});