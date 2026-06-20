// src/components/EMR/components/VaccinationsCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import moment from 'moment-jalaali';

interface Vaccination {
  id?: string;
  type: string;
  date: string;
}

interface VaccinationsCardProps {
  patientInfo?: { vaccinations?: Vaccination[] };
}

const VaccinationsCard: React.FC<VaccinationsCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const vaccinations = patientInfo?.vaccinations ?? [];

  return (
    <EMRSectionCard
      title={t('savabeghVaksan')}
      icon="shield-checkmark-outline"
      iconColor="#22c55e"
      badge={vaccinations.length}
      delay={260}
      isEmpty={vaccinations.length === 0}
      emptyText={t('NoData')}
    >
      <View style={{ gap: 8 }}>
        {vaccinations.map((vac, idx) => (
          <View
            key={vac.id || vac.type || String(idx)}
            style={[
              styles.vacRow,
              {
                flexDirection: direction.isRTL ? 'row-reverse' : 'row',
                backgroundColor: isDark ? colors.surface : '#f0fdf4',
                borderColor: isDark ? colors.border : '#bbf7d0',
              },
            ]}
          >
            <View style={styles.vacIcon}>
              <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
            </View>
            <View style={[{ flex: 1 }, direction.startItems]}>
              <Text
                style={[
                  styles.vacType,
                  { color: colors.text, writingDirection: direction.dir },
                ]}
              >
                {vac.type}
              </Text>
              <Text
                style={[
                  styles.vacDate,
                  { color: colors.textSecondary },
                ]}
              >
                {moment(vac.date).format('jYYYY/jMM/jDD')}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </EMRSectionCard>
  );
};

const styles = StyleSheet.create({
  vacRow: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    padding: 10,
  },
  vacIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  vacType: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 13,
  },
  vacDate: {
    fontFamily: 'IRANSans',
    fontSize: 11,
    marginTop: 2,
    writingDirection: 'ltr',
  },
});

export default VaccinationsCard;