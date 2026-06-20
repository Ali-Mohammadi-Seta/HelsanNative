// src/components/EMR/components/SurgeriesCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/styles/theme';
import { useDirection } from '@/lib/hooks/useDirection';
import EMRSectionCard from './EMRSectionCard';
import DataRow from './DataRow';
import moment from 'moment-jalaali';

interface SurgeryRecord {
  id?: string;
  name: string;
  type: string;
  surgeonName: string;
  anesthesiaType: string;
  medicalCenterName: string;
  date: string;
  time: string;
}

interface SurgeriesCardProps {
  patientInfo?: { surgeries?: SurgeryRecord[] };
}

const SurgeriesCard: React.FC<SurgeriesCardProps> = ({ patientInfo }) => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const direction = useDirection();
  const surgeries = patientInfo?.surgeries ?? [];

  return (
    <EMRSectionCard
      title={t('savabeghJarahi')}
      icon="cut-outline"
      iconColor="#8b5cf6"
      badge={surgeries.length}
      delay={220}
      isEmpty={surgeries.length === 0}
      emptyText={t('NoData')}
    >
      <View style={{ gap: 12 }}>
        {surgeries.map((surgery, idx) => (
          <View
            key={surgery.id || surgery.name || String(idx)}
            style={[
              styles.surgeryCard,
              {
                backgroundColor: isDark ? colors.surface : '#f8fafc',
                borderColor: isDark ? colors.border : '#e5e7eb',
              },
            ]}
          >
            <View
              style={[
                styles.surgeryHeader,
                { flexDirection: direction.isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <Text
                style={[
                  styles.surgeryName,
                  { color: '#8b5cf6', writingDirection: direction.dir },
                ]}
              >
                {surgery.name}
              </Text>
              <View style={[styles.typeBadge, { backgroundColor: '#8b5cf618' }]}>
                <Text style={[styles.typeText, { color: '#8b5cf6' }]}>{surgery.type}</Text>
              </View>
            </View>
            <DataRow label={t('surgeonName')} value={surgery.surgeonName} />
            <DataRow label={t('anesthesiaType')} value={surgery.anesthesiaType} />
            <DataRow label={t('medicalCenterName')} value={surgery.medicalCenterName} />
            <DataRow
              label={t('surgeryDate')}
              value={`${moment(surgery.date).format('jYYYY/jMM/jDD')} - ${surgery.time}`}
              last
            />
          </View>
        ))}
      </View>
    </EMRSectionCard>
  );
};

const styles = StyleSheet.create({
  surgeryCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
  },
  surgeryHeader: {
    alignItems: 'center',
    gap: 8,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  surgeryName: {
    flex: 1,
    fontFamily: 'IRANSans-Bold',
    fontSize: 14,
  },
  typeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typeText: {
    fontFamily: 'IRANSans-Bold',
    fontSize: 11,
  },
});

export default SurgeriesCard;