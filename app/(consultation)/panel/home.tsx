import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/styles/theme';
import { useTranslation } from 'react-i18next';
import { useDirection } from '@/lib/hooks/useDirection';
import { useGetConsultationProfile } from '@/consultation/api/useConsultationAuth';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function ConsultationHomeScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const direction = useDirection();
  const { data: profile } = useGetConsultationProfile();

  const isCitizen = profile?.activeRole === 'Citizen' || !profile?.activeRole;

  const renderQuickAction = (icon: any, label: string, color: string, onPress: () => void, index: number) => (
    <MotiView
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', delay: index * 100 }}
      style={{ width: '48%', marginBottom: 12 }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={[
          styles.actionCard,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.card,
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
          }
        ]}
      >
        <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={[styles.actionLabel, { color: colors.text }]}>{label}</Text>
      </TouchableOpacity>
    </MotiView>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <LinearGradient
        colors={isDark ? ['#1e293b', '#0f172a'] : ['#e0f2fe', '#bae6fd']}
        style={[styles.welcomeBanner, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}
      >
        <View style={[styles.welcomeInfo, direction.startItems]}>
          <Text style={[styles.welcomeTitle, { color: isDark ? '#fff' : '#0369a1', textAlign: direction.isRTL ? 'right' : 'left' }]}>
            {isCitizen ? t('homePage.consultationBannerTitle', { defaultValue: 'مشاوره پزشکی آنلاین' }) : t('roles.providerDashboard', { defaultValue: 'پیشخوان پزشک' })}
          </Text>
          <Text style={[styles.welcomeSub, { color: isDark ? '#cbd5e1' : '#0284c7', textAlign: direction.isRTL ? 'right' : 'left' }]}>
            {t('homePage.consultationBannerDesc', { defaultValue: 'دسترسی سریع و آسان به بهترین پزشکان' })}
          </Text>
        </View>
        <Ionicons name="medical" size={48} color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(3, 105, 161, 0.2)'} style={{ position: 'absolute', right: direction.isRTL ? undefined : 16, left: direction.isRTL ? 16 : undefined }} />
      </LinearGradient>

      <Text style={[styles.sectionTitle, { color: colors.text, textAlign: direction.isRTL ? 'right' : 'left' }]}>
        {t('generalMessages.quickAccess', { defaultValue: 'دسترسی سریع' })}
      </Text>

      <View style={[styles.actionsGrid, { flexDirection: direction.isRTL ? 'row-reverse' : 'row' }]}>
        {isCitizen ? (
          <>
            {renderQuickAction('people', t('roles.doctor', { defaultValue: 'پزشکان' }), '#3b82f6', () => router.push('/(consultation)/panel/providers'), 0)}
            {renderQuickAction('pulse', t('roles.psychologist', { defaultValue: 'روانشناسان' }), '#8b5cf6', () => router.push('/(consultation)/panel/providers'), 1)}
            {renderQuickAction('chatbubbles', t('messages', { defaultValue: 'پیام‌های من' }), '#10b981', () => router.push('/(consultation)/panel/tickets'), 2)}
            {renderQuickAction('calendar', t('calendar', { defaultValue: 'نوبت‌های من' }), '#f59e0b', () => router.push('/(consultation)/panel/appointments'), 3)}
          </>
        ) : (
          <>
            {renderQuickAction('calendar', t('calendar', { defaultValue: 'تقویم نوبت‌ها' }), '#f59e0b', () => router.push('/(consultation)/panel/appointments'), 0)}
            {renderQuickAction('chatbubbles', t('messages', { defaultValue: 'تیکت‌های مشاوره' }), '#10b981', () => router.push('/(consultation)/panel/tickets'), 1)}
            {renderQuickAction('settings', t('settings', { defaultValue: 'تنظیمات مشاوره' }), '#64748b', () => router.push('/(consultation)/panel/profile'), 2)}
            {renderQuickAction('wallet', t('financial', { defaultValue: 'امور مالی' }), '#14b8a6', () => router.push('/(consultation)/panel/wallet'), 3)}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  welcomeBanner: {
    padding: 20,
    borderRadius: 24,
    marginBottom: 24,
    overflow: 'hidden',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  welcomeInfo: {
    flex: 1,
    zIndex: 1,
  },
  welcomeTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 20,
    marginBottom: 8,
  },
  welcomeSub: {
    fontFamily: 'IRANSans',
    fontSize: 13,
  },
  sectionTitle: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 16,
    marginBottom: 16,
  },
  actionsGrid: {
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionLabel: {
    fontFamily: 'IRANSans-Medium',
    fontSize: 13,
  },
});
