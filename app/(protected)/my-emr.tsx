// app/(protected)/my-emr.tsx
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { BackHeader } from '@/components'; // ✅ Import BackHeader

export default function MyEmrScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      {/* ✅ Custom Back Header */}
      <BackHeader title={t('myDoc')} />

      <ScrollView
        style={[styles.container, { backgroundColor: isDark ? colors.background : '#ffffff' }]}
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.title, { color: isDark ? colors.text : '#000000' }]}>
          📋 {t('myDoc')}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? colors.textSecondary : '#666666' }]}>
          {t('healthRec')}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'IRANSans',
  },
});