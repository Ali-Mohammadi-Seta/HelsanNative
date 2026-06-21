import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import { useGetConsultationProfile, useChangeActiveRole } from '@/consultation/api/useConsultationAuth';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';

const RolesEnum: Record<string, any> = {
  Doctor: { icon: 'medical', labelKey: 'roles.doctor', defaultLabel: 'پزشک' },
  Psychologist: { icon: 'pulse', labelKey: 'roles.psychologist', defaultLabel: 'روانشناس' },
  Citizen: { icon: 'person', labelKey: 'roles.citizen', defaultLabel: 'شهروند' },
};

export default function RoleSelectScreen() {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const { data: profile, isLoading } = useGetConsultationProfile();
  const { mutate: changeRole, isPending } = useChangeActiveRole();

  // If only 1 role or active role is already set and user refreshes, we can just push to home
  useEffect(() => {
    if (!isLoading && profile) {
      if (profile.roles?.length === 1) {
        router.replace('/(consultation)/panel/home');
      }
    }
  }, [profile, isLoading]);

  const handleSelectRole = (role: string) => {
    changeRole(role, {
      onSuccess: () => {
        router.replace('/(consultation)/panel/home');
      },
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, padding: 24, justifyContent: 'center' }}>
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : colors.card,
          padding: 24,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.3 : 0.05,
          shadowRadius: 20,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Ionicons name="people" size={32} color="#fff" />
          </View>
          <Text style={{ fontFamily: 'IRANSans-Bold', fontSize: 20, color: colors.text, marginBottom: 8 }}>
            {t('roles.selectRole', { defaultValue: 'انتخاب پنل کاربری' })}
          </Text>
          {profile?.firstName && (
            <Text style={{ fontFamily: 'IRANSans-Medium', fontSize: 14, color: colors.textSecondary }}>
              سلام {profile.firstName} {profile.lastName}
            </Text>
          )}
        </View>

        <View style={{ gap: 12 }}>
          {profile?.roles?.map((role, index) => {
            const roleConfig = RolesEnum[role] || { icon: 'person', defaultLabel: role };
            const isActive = profile.activeRole === role;

            return (
              <MotiView
                key={role}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: index * 100 }}
              >
                <TouchableOpacity
                  onPress={() => handleSelectRole(role)}
                  disabled={isPending}
                  style={{
                    flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                    alignItems: 'center',
                    padding: 16,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.1)' : colors.border,
                    backgroundColor: isActive ? (isDark ? 'rgba(var(--primary-rgb), 0.15)' : 'rgba(var(--primary-rgb), 0.05)') : 'transparent',
                  }}
                >
                  <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: isActive ? colors.primary : isDark ? 'rgba(255,255,255,0.1)' : colors.background, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name={roleConfig.icon as any} size={20} color={isActive ? '#fff' : colors.text} />
                  </View>
                  <Text style={{ flex: 1, fontFamily: 'IRANSans-Bold', fontSize: 15, color: isActive ? colors.primary : colors.text, marginHorizontal: 16, textAlign: direction.isRTL ? 'right' : 'left' }}>
                    {t(roleConfig.labelKey, { defaultValue: roleConfig.defaultLabel })}
                  </Text>
                  {isActive ? (
                    <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                  ) : (
                    <Ionicons name={direction.isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textTertiary} />
                  )}
                </TouchableOpacity>
              </MotiView>
            );
          })}
        </View>
      </MotiView>
    </View>
  );
}
