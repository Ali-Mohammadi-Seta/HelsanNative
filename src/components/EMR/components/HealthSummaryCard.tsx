// src/components/EMR/components/HealthSummaryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { MotiView } from 'moti';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';


// src/utils/emrConstants.ts
export const dataNames: Record<string, string> = {
  hormonalProblems:   'مشکلات هورمونی / Hormonal Problems',
  diabetes:           'دیابت / Diabetes',
  heartDisease:       'بیماری قلبی / Heart Disease',
  bloodPressure:      'فشار خون / Blood Pressure',
  asthma:             'آسم / Asthma',
  epilepsy:           'صرع / Epilepsy',
  kidneyDisease:      'بیماری کلیوی / Kidney Disease',
  liverDisease:       'بیماری کبدی / Liver Disease',
  cancerHistory:      'سابقه سرطان / Cancer History',
  mentalDisorders:    'اختلالات روانی / Mental Disorders',
  smoker:             'سیگاری / Smoker',
  alcohol:            'مصرف الکل / Alcohol',
  drugAbuse:          'اعتیاد / Drug Abuse',
};

export const ALL_QUESTIONS_COUNT = 13;



interface HealthSummaryCardProps {
  patientInfo?: any;
}

type VitalItem = {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
};

const HealthSummaryCard: React.FC<HealthSummaryCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();

  const latestHealthStatus = patientInfo?.health?.latestHealthStatus ?? {};
  const lastVitalSign = patientInfo?.health?.lastVitalSign ?? {};
  const latestBP = lastVitalSign.bloodPressure?.slice(-1)[0];
  const latestBS = lastVitalSign.bloodSuger?.slice(-1)[0];

  const vitalItems: VitalItem[] = [
    lastVitalSign.temp != null && {
      label: t('Temperature'),
      value: `${lastVitalSign.temp} °C`,
      icon: 'thermometer-outline' as const,
      color: '#f59e0b',
    },
    lastVitalSign.pulse != null && {
      label: t('heartBeats'),
      value: `${lastVitalSign.pulse} bpm`,
      icon: 'heart-outline' as const,
      color: '#ef4444',
    },
    lastVitalSign.resp != null && {
      label: t('breathing'),
      value: `${lastVitalSign.resp} /min`,
      icon: 'fitness-outline' as const,
      color: '#3b82f6',
    },
    latestBP?.upper && {
      label: t('bloodPressure'),
      value: `${latestBP.upper}/${latestBP.lower}`,
      icon: 'heart-circle-outline' as const,
      color: '#8b5cf6',
    },
    latestBS?.beforeMeal && {
      label: t('nashta'),
      value: `${latestBS.beforeMeal} mg/dL`,
      icon: 'flask-outline' as const,
      color: '#06b6d4',
    },
    latestBS?.afterMeal && {
      label: t('ghandbad'),
      value: `${latestBS.afterMeal} mg/dL`,
      icon: 'beaker-outline' as const,
      color: '#10b981',
    },
  ].filter(Boolean) as VitalItem[];

  const statusItems = Object.entries(dataNames).map(([key, label]) => {
    const val = latestHealthStatus[key];
    return {
      key,
      label,
      status: val === '1' ? 'yes' : val === '0' ? 'no' : 'unknown',
      displayValue:
        val === '1' ? t('have') : val === '0' ? t('haveNot') : '-',
    };
  });

  const totalItems = vitalItems.length + statusItems.length;

  return (
    <EMRSectionCard
      title={t('PatientHealthStatus')}
      icon="pulse-outline"
      iconColor="#ef4444"
      badge={totalItems}
      defaultExpanded
      delay={80}
      isEmpty={totalItems === 0}
      emptyText={t('NoData')}
    >
      {/* ── Vital mini-cards ── */}
      {vitalItems.length > 0 && (
        <>
          <SectionSubtitle
            label={direction.isRTL ? 'علائم حیاتی' : 'Vital Signs'}
            colors={colors}
            direction={direction}
          />
          <View style={styles.vitalGrid}>
            {vitalItems.map((item, idx) => (
              <MotiView
                key={item.label}
                from={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 130, delay: idx * 45 }}
                style={[
                  styles.vitalChip,
                  {
                    backgroundColor: isDark ? colors.surface : `${item.color}0d`,
                    borderColor: `${item.color}28`,
                  },
                ]}
              >
                <View style={[styles.vitalIconWrap, { backgroundColor: `${item.color}1e` }]}>
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text
                  style={[
                    styles.vitalLabel,
                    { color: colors.textSecondary, writingDirection: direction.dir },
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
                <Text style={[styles.vitalValue, { color: item.color }]}>
                  {item.value}
                </Text>
              </MotiView>
            ))}
          </View>
        </>
      )}

      {/* ── Health Status grid ── */}
      {statusItems.length > 0 && (
        <>
          <SectionSubtitle
            label={direction.isRTL ? 'وضعیت سلامت' : 'Health Status'}
            colors={colors}
            direction={direction}
            topSpacing
          />
          <View style={styles.statusGrid}>
            {statusItems.map((item, idx) => {
              const dotColor =
                item.status === 'yes'
                  ? '#ef4444'
                  : item.status === 'no'
                  ? '#22c55e'
                  : '#9ca3af';
              const valuColor =
                item.status === 'yes'
                  ? '#ef4444'
                  : item.status === 'no'
                  ? '#22c55e'
                  : colors.textTertiary;

              return (
                <MotiView
                  key={item.key}
                  from={{ opacity: 0, translateX: direction.isRTL ? 12 : -12 }}
                  animate={{ opacity: 1, translateX: 0 }}
                  transition={{ type: 'timing', duration: 260, delay: idx * 30 }}
                  style={[
                    styles.statusChip,
                    {
                      flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                      backgroundColor: isDark ? colors.surface : '#f9fafb',
                      borderColor: isDark ? colors.border : '#e5e7eb',
                    },
                  ]}
                >
                  <View style={[styles.statusDot, { backgroundColor: dotColor }]} />
                  <View style={[{ flex: 1 }, direction.startItems]}>
                    <Text
                      style={[
                        styles.statusLabel,
                        { color: colors.textSecondary, writingDirection: direction.dir },
                      ]}
                      numberOfLines={2}
                    >
                      {item.label}
                    </Text>
                    <Text style={[styles.statusValue, { color: valuColor }]}>
                      {item.displayValue}
                    </Text>
                  </View>
                </MotiView>
              );
            })}
          </View>
        </>
      )}
    </EMRSectionCard>
  );
};

function SectionSubtitle({
  label,
  colors,
  direction,
  topSpacing = false,
}: {
  label: string;
  colors: any;
  direction: any;
  topSpacing?: boolean;
}) {
  return (
    <Text
      style={[
        styles.subheading,
        {
          color: colors.textSecondary,
          writingDirection: direction.dir,
          marginTop: topSpacing ? 16 : 0,
          textAlign: direction.isRTL ? 'right' : 'left',
        },
      ]}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  subheading: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
    letterSpacing: 0.4,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  vitalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  vitalChip: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
    padding: 14,
    width: '47%',
  },
  vitalIconWrap: {
    alignItems: 'center',
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  vitalLabel: {
    fontFamily: 'IRANSans',
    fontSize: 10,
    textAlign: 'center',
  },
  vitalValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
    textAlign: 'center',
  },
  statusGrid: {
    gap: 8,
  },
  statusChip: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 10,
  },
  statusDot: {
    borderRadius: 999,
    height: 9,
    width: 9,
  },
  statusLabel: {
    fontFamily: 'IRANSans',
    fontSize: 12,
    lineHeight: 18,
  },
  statusValue: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 12,
    marginTop: 1,
  },
});

export default HealthSummaryCard;