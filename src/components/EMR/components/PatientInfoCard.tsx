// src/components/EMR/components/PatientInfoCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import { useTheme, gradients, shadows } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import { useTranslation } from 'react-i18next';
import moment from 'moment-jalaali';

interface PatientInfoCardProps {
  patientInfo?: any;
  userProfile?: any;
}

const PatientInfoCard: React.FC<PatientInfoCardProps> = ({ patientInfo, userProfile }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const firstName = patientInfo?.firstName || userProfile?.firstName || '';
  const lastName = patientInfo?.lastName || userProfile?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ') || '-';
  const nationalId = patientInfo?.nationalId || userProfile?.nationalId || '-';
  const birthdate = patientInfo?.birthdate || userProfile?.birthDate;
  const phone = userProfile?.phone || '-';
  const bloodGroup = patientInfo?.health?.latestHealthStatus?.bloodGroup;
  const bloodRH = patientInfo?.health?.latestHealthStatus?.bloodRH;
  const insurance = patientInfo?.insuranceCompany || '-';

  const calculateAge = (bd?: string | null): string => {
    if (!bd) return '-';
    try {
      const birthYear = moment(bd).jYear();
      const currentYear = moment().jYear();
      return String(currentYear - birthYear);
    } catch {
      return '-';
    }
  };

  const age = calculateAge(birthdate);

  const gradientColors = isDark
    ? gradients.heroBanner.dark
    : (['#ecfdf5', '#f0fdf4', '#ffffff'] as [string, string, string]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'spring', damping: 18, stiffness: 150 }}
      style={[styles.wrap, shadows.lg]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.card,
          {
            borderColor: isDark ? colors.border : '#d1fae5',
          },
        ]}
      >
        {/* Avatar row */}
        <View
          style={[
            styles.avatarRow,
            { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: `${colors.primary}22` }]}>
            <Ionicons name="person" size={34} color={colors.primary} />
          </View>
          <View
            style={[
              styles.avatarInfo,
              direction.startItems,
            ]}
          >
            <Text
              style={[
                styles.name,
                { color: colors.text, writingDirection: direction.dir },
              ]}
            >
              {fullName}
            </Text>
            <View
              style={[
                styles.badgeRow,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              {bloodGroup && (
                <View style={[styles.bloodBadge, { backgroundColor: '#fef2f2' }]}>
                  <Text style={[styles.bloodText, { color: '#dc2626' }]}>
                    {bloodRH === t('mosbat') ? '+' : bloodRH ? '-' : ''}
                    {bloodGroup}
                  </Text>
                </View>
              )}
              <View style={[styles.ageBadge, { backgroundColor: `${colors.primary}18` }]}>
                <Text style={[styles.ageText, { color: colors.primary }]}>
                  {age} {direction.isRTL ? 'سال' : 'yrs'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.infoGrid}>
          <InfoChip
            icon="card-outline"
            label={t('natCode')}
            value={nationalId}
            colors={colors}
            isDark={isDark}
            direction={direction}
          />
          <InfoChip
            icon="call-outline"
            label={t('phone') || 'Phone'}
            value={phone}
            colors={colors}
            isDark={isDark}
            direction={direction}
          />
          <InfoChip
            icon="shield-checkmark-outline"
            label={t('bimeTarafGharardad')}
            value={insurance}
            colors={colors}
            isDark={isDark}
            direction={direction}
          />
        </View>
      </LinearGradient>
    </MotiView>
  );
};

function InfoChip({
  icon,
  label,
  value,
  colors,
  isDark,
  direction,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: any;
  isDark: boolean;
  direction: any;
}) {
  return (
    <View
      style={[
        styles.chip,
        {
          flexDirection: direction.isRTL ? 'row-reverse' : 'row',
          backgroundColor: isDark ? colors.surface : 'rgba(255,255,255,0.75)',
          borderColor: isDark ? colors.border : '#dbeafe',
        },
      ]}
    >
      <Ionicons name={icon} size={15} color={colors.primary} />
      <View style={[direction.startItems, { flex: 1, marginHorizontal: 8 }]}>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: 'IRANSans',
            fontSize: 10,
            writingDirection: direction.dir,
          }}
        >
          {label}
        </Text>
        <Text
          style={{
            color: colors.text,
            fontFamily: 'IRANSans-Bold',
            fontSize: 12,
            writingDirection: direction.dir,
          }}
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 14,
    borderRadius: 22,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  avatarRow: {
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    alignItems: 'center',
    borderRadius: 20,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  avatarInfo: {
    flex: 1,
    gap: 8,
  },
  name: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 19,
    lineHeight: 28,
  },
  badgeRow: {
    alignItems: 'center',
    gap: 8,
  },
  bloodBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  bloodText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 12,
  },
  ageBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  ageText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 12,
  },
  infoGrid: {
    gap: 8,
  },
  chip: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    gap: 0,
  },
});

export default PatientInfoCard;
